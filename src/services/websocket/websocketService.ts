import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { router } from "expo-router";
import { AppState, AppStateStatus } from "react-native";
import { haptics } from "@/utils/haptics";
import { AppDispatch, store, RootState } from "@/store";
import { updateAppointmentLocal, Appointment } from "@/store/slices/appointmentSlice";
import { addNotification, Notification } from "@/store/slices/notificationSlice";
import { webSocketEndpoints } from "./websocketEndpoints";
import { getValidToken, getUserId, getDoctorId } from "@/services/auth/tokenService";

type WebSocketResponseType = 'NOTIFICATION' | 'APPOINTMENT';

type WebSocketResponse<T> = {
    type: WebSocketResponseType;
    payload: T;
};

type WebSocketMessage =
    | WebSocketResponse<Appointment>
    | WebSocketResponse<Notification>;

class WebsocketService {
    private stompClient: Client | null = null;
    private isConnecting = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 15;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private appointmentSubscription: StompSubscription | null = null;
    private notificationSubscription: StompSubscription | null = null;
    private appStateListener: ((state: AppStateStatus) => void) | null = null;
    private appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;
    private connectionPromise: Promise<void> | null = null;
    private dispatch: AppDispatch | null = null;
    private getProfileState: (() => { doctorId?: string }) | null = null;
    private userId: string | null = null;
    private doctorId: string | null = null;

    private get isConnected(): boolean {
        return !!this.stompClient?.connected;
    }

    public get connected(): boolean {
        return this.isConnected;
    }

    public getConnectionStatus(): { connected: boolean; connecting: boolean } {
        return {
            connected: this.isConnected,
            connecting: this.isConnecting,
        };
    }

    public initialize(dispatch: AppDispatch, getProfileState: () => { doctorId?: string }): void {
        this.dispatch = dispatch;
        this.getProfileState = getProfileState;
    }

    public async connect(): Promise<void> {
        if (!this.dispatch || !this.getProfileState) {
            console.warn("WebSocket: Attempted to connect before initialization. Call initialize() first.");
            return;
        }

        // Check if authenticated before connecting
        const state = store.getState() as RootState;
        if (!state.auth.isAuthenticated) {
            // Silently return to avoid spamming logs on auth screens
            return;
        }

        if (this.isConnected) {
            return;
        }

        if (this.isConnecting && this.connectionPromise) {
            return this.connectionPromise;
        }

        this.isConnecting = true;
        this.connectionPromise = this.attemptConnection();

        try {
            await this.connectionPromise;
        } finally {
            this.connectionPromise = null;
        }
    }

    private async attemptConnection(): Promise<void> {
        try {
            const token = await getValidToken(true);
            if (!token) {
                console.warn("WebSocket: Authentication token not found or expired");
                this.isConnecting = false;
                return;
            }

            // Extract and store userId and doctorId for notification subscription
            this.userId = getUserId(token);
            this.doctorId = getDoctorId(token);

            if (!this.userId || !this.doctorId) {
                console.error("WebSocket: Cannot extract userId or doctorId from token");
                this.isConnecting = false;
                return;
            }

            const wsUrl = `${webSocketEndpoints.handShake}?token=${encodeURIComponent(token)}`;
            // @ts-ignore
            const socket = new SockJS(wsUrl);

            this.stompClient = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 0,
                onConnect: () => {
                    this.reconnectAttempts = 0;
                    this.isConnecting = false;

                    // Subscribe to doctor-specific appointment channel using ID from token
                    if (this.doctorId) {
                        this.subscribeToDoctorChannel(this.doctorId);
                    }

                    // Subscribe to user notifications with delay to ensure connection is stable
                    setTimeout(() => {
                        this.subscribeToNotifications();
                    }, 100);
                },
                onStompError: (frame) => {
                    console.error("WebSocket: STOMP error", frame);
                    try {
                        if (frame.headers && frame.headers.message &&
                            (frame.headers.message.includes("401") ||
                                frame.headers.message.includes("UNAUTHORIZED") ||
                                frame.headers.message.includes("authentication"))) {
                            console.error("WebSocket: Authentication failed");
                            this.cleanup();
                            getValidToken().then((hasToken: string | null) => {
                                if (!hasToken) {
                                    setTimeout(() => {
                                        router.replace('/(auth)');
                                    }, 0);
                                }
                            });
                            return;
                        }
                        this.handleDisconnect();
                    } catch (error) {
                        console.error("WebSocket: Error in STOMP error handler", error);
                        this.cleanup();
                    }
                },
                onWebSocketClose: (event) => {
                    try {
                        if (event.code === 1008 || event.code === 1002) {
                            console.error("WebSocket: Connection closed due to authentication failure");
                            this.cleanup();
                            getValidToken().then((hasToken: string | null) => {
                                if (!hasToken) {
                                    setTimeout(() => {
                                        router.replace('/(auth)');
                                    }, 0);
                                }
                            });
                            return;
                        }
                        this.handleDisconnect();
                    } catch (error) {
                        console.error("WebSocket: Error in close handler", error);
                        this.cleanup();
                    }
                },
                onDisconnect: () => {
                },
            });

            this.stompClient.activate();
        } catch (error: unknown) {
            console.error("WebSocket: Connection error", error);
            this.isConnecting = false;

            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStatus = (error as { status?: number })?.status;

            if (errorStatus === 401 || errorMessage.includes("401") ||
                errorMessage.includes("UNAUTHORIZED")) {
                getValidToken().then((hasToken: string | null) => {
                    if (!hasToken) {
                        setTimeout(() => {
                            router.replace('/(auth)');
                        }, 0);
                    }
                });
                return;
            }

            this.handleDisconnect();
        } finally {
            this.isConnecting = false;
        }
    }

    private subscribeToDoctorChannel(doctorId: string): void {
        if (!this.stompClient || !this.isConnected) {
            console.warn("WebSocket: Cannot subscribe - no active connection");
            return;
        }

        if (this.appointmentSubscription) {
            try {
                this.appointmentSubscription.unsubscribe();
            } catch (error) {
                console.warn("WebSocket: Error unsubscribing from previous appointment channel", error);
            }
            this.appointmentSubscription = null;
        }

        try {
            this.appointmentSubscription = this.stompClient.subscribe(
                webSocketEndpoints.appointmentUpdate(doctorId),
                (message: IMessage) => {
                    try {
                        const update = JSON.parse(message.body);
                        this.handleIncomingMessage(update);
                    } catch (error) {
                        console.error("WebSocket: Error parsing appointment message", error);
                    }
                }
            );
        } catch (error) {
            console.error("WebSocket: Error subscribing to appointment channel", error);
        }
    }

    private subscribeToNotifications(): void {
        if (!this.stompClient || !this.isConnected) {
            console.warn("WebSocket: Cannot subscribe to notifications - no active connection");
            return;
        }

        if (!this.userId) {
            console.error("WebSocket: Cannot subscribe to notifications - userId not set");
            return;
        }

        if (this.notificationSubscription) {
            try {
                this.notificationSubscription.unsubscribe();
            } catch (error) {
                console.warn("WebSocket: Error unsubscribing from previous notification channel", error);
            }
            this.notificationSubscription = null;
        }

        try {
            const topic = webSocketEndpoints.notificationUpdate(this.userId);

            this.notificationSubscription = this.stompClient.subscribe(
                topic,
                (message: IMessage) => {
                    try {
                        const update = JSON.parse(message.body);
                        this.handleIncomingMessage(update);
                    } catch (error) {
                        console.error("WebSocket: Error parsing notification message", error);
                    }
                }
            );
        } catch (error) {
            console.error("WebSocket: Error subscribing to notification channel", error);
        }
    }

    private handleIncomingMessage(message: WebSocketMessage | unknown): void {
        try {
            if (!message || typeof message !== 'object') {
                console.warn('WebSocket: Received non-object message:', message);
                return;
            }

            if (!('type' in message) || !('payload' in message)) {
                console.warn('WebSocket: Message missing type or payload:', JSON.stringify(message));
                // Still try to handle if it looks like a direct notification (backward compatibility)
                if ('title' in message && 'message' in message) {
                    this.handleNotificationUpdate(message as Notification);
                    return;
                }
                return;
            }

            const wsMessage = message as WebSocketMessage;

            switch (wsMessage.type) {
                case 'APPOINTMENT':
                    this.handleAppointmentUpdate(wsMessage.payload as Appointment);
                    break;

                case 'NOTIFICATION':
                    this.handleNotificationUpdate(wsMessage.payload as Notification);
                    break;

                default:
                    console.warn('Unknown message type:', (message as { type: string }).type);
                    break;
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    }

    private handleAppointmentUpdate(updatedAppointment: Partial<Appointment> | Appointment): void {
        try {
            if (!updatedAppointment || typeof updatedAppointment !== 'object') {
                console.warn('WebSocket: Invalid appointment data received');
                return;
            }

            if (!this.dispatch) {
                console.error('WebSocket: Dispatch not initialized');
                return;
            }

            if ('appointmentId' in updatedAppointment && updatedAppointment.appointmentId) {
                const appointment = updatedAppointment as Appointment;
                this.dispatch(updateAppointmentLocal(appointment));

                // Trigger vibration strictly based on Emergency Override setting
                const { emergencyAlertsEnabled } = store.getState().userSettings;
                if (emergencyAlertsEnabled) {
                    haptics.impact(true); // Force impact for appointment critical updates
                }
            } else {
                console.warn('WebSocket: Received appointment without appointmentId');
            }
        } catch (error) {
            console.error('WebSocket: Error handling appointment update:', error);
        }
    }

    private handleNotificationUpdate(notificationData: Notification | Partial<Notification>): void {
        try {
            const notification: Notification = {
                id: notificationData.id || `notification-${Date.now()}`,
                type: notificationData.type || 'SYSTEM',
                title: notificationData.title || 'New Notification',
                message: notificationData.message || '',
                isRead: notificationData.isRead ?? false,
                createdAt: notificationData.createdAt || new Date().toISOString(),
            };

            if (!this.dispatch) {
                console.error('WebSocket: Dispatch not initialized');
                return;
            }

            // Check if notification already exists in store to prevent duplicate vibration
            const currentState = store.getState();
            const exists = currentState.notifications.items.some(n => n.id === notification.id);

            if (!exists && !notification.isRead) {
                const { notificationsVibrationEnabled } = store.getState().userSettings;

                // Trigger vibration strictly based on Notification Vibration setting
                if (notificationsVibrationEnabled) {
                    haptics.impact();
                }
            }

            this.dispatch(addNotification(notification));
        } catch (error) {
            console.error('WebSocket: Error handling notification update:', error);
        }
    }

    private handleDisconnect(): void {
        this.cleanup();
        this.scheduleReconnect();
    }

    private scheduleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.warn(`WebSocket: Max reconnection attempts (${this.maxReconnectAttempts}) reached. Stopping reconnection.`);
            return;
        }

        const baseDelay = 1000;
        const exponentialDelay = baseDelay * Math.pow(2, this.reconnectAttempts);
        const delay = Math.min(exponentialDelay, 30000);
        this.reconnectAttempts++;

        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, delay);
    }

    private cleanup(): void {
        if (this.appointmentSubscription) {
            try {
                if (this.stompClient?.connected) {
                    this.appointmentSubscription.unsubscribe();
                }
            } catch (error) {
                console.warn("WebSocket: Error unsubscribing from appointments during cleanup", error);
            }
            this.appointmentSubscription = null;
        }

        if (this.notificationSubscription) {
            try {
                if (this.stompClient?.connected) {
                    this.notificationSubscription.unsubscribe();
                }
            } catch (error) {
                console.warn("WebSocket: Error unsubscribing from notifications during cleanup", error);
            }
            this.notificationSubscription = null;
        }

        if (this.stompClient) {
            try {
                if (this.stompClient.active) {
                    this.stompClient.deactivate();
                }
            } catch (error) {
                console.warn("WebSocket: Error deactivating client", error);
            }
            this.stompClient = null;
        }

        this.isConnecting = false;
    }

    public disconnect(): void {
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
        this.cleanup();
        this.reconnectAttempts = 0;
    }

    public resetReconnectionAttempts(): void {
        this.reconnectAttempts = 0;
    }

    public async forceReconnect(): Promise<void> {
        this.disconnect();
        await this.connect();
    }

    public async ensureConnected(): Promise<void> {
        if (!this.isConnected && !this.isConnecting) {
            await this.connect();
        }
    }

    public initializeAppStateListener(): void {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }

        this.appStateListener = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                this.disconnect();
            } else if (nextAppState === 'active') {
                this.resetReconnectionAttempts();
                this.ensureConnected();
            }
        };

        this.appStateSubscription = AppState.addEventListener('change', this.appStateListener);
    }

    public removeAppStateListener(): void {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
            this.appStateListener = null;
        }
    }
}

export const websocketAppointment = new WebsocketService();
