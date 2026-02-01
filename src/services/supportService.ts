import { client, ApiResponse } from './api/client';
import { endpoints } from './api/endpoints';

export interface SupportTicketPayload {
    subject: string;
    category: string;
    message: string;
}

export const SupportService = {
    createTicket: async (payload: SupportTicketPayload): Promise<void> => {
        await client.post<ApiResponse<any>>(endpoints.support.createTicket, payload);
    },
};
