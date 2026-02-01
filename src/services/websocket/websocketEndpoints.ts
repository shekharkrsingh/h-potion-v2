import { API_BASE_URL } from "@/services/api/endpoints";

export const webSocketEndpoints = {
    // SockJS handshake requires HTTP/HTTPS, matching the API base
    handShake: `${API_BASE_URL}/ws`,
    appointmentUpdate: (doctorId: string) => `/topic/appointments/${doctorId}`,
    notificationUpdate: (userId: string) => `/topic/notifications/${userId}`,
};
