import { API_BASE_URL } from "@/services/api/endpoints";

// Convert http/https → ws/wss for native WebSocket protocol
const wsBaseUrl = API_BASE_URL.replace(/^https:\/\//, 'wss://').replace(/^http:\/\//, 'ws://');

export const webSocketEndpoints = {
    // /ws-native: raw WebSocket endpoint on the backend (no SockJS overhead).
    // Used by @stomp/stompjs brokerURL directly with React Native's native WebSocket engine.
    handShake: `${wsBaseUrl}/ws-native`,
    appointmentUpdate: (doctorId: string) => `/topic/appointments/${doctorId}`,
    notificationUpdate: (userId: string) => `/topic/notifications/${userId}`,
};
