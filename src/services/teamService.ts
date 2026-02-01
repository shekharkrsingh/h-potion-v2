import { client, ApiResponse } from './api/client';
import { endpoints } from './api/endpoints';

export interface Collaborator {
    id?: string;
    collaboratorId?: string; // Legacy compatibility
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'ACTIVATED' | 'DEACTIVATED' | 'INVITED';
    profilePicture?: string;
    joinedAt?: string;
    createdAt?: string;
    phoneNumber?: string;
}

export interface Invitation {
    id?: string;
    invitationId?: string; // Legacy compatibility
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    status: 'PENDING' | 'EXPIRED' | 'REVOKED' | 'INVITED';
    sentAt?: string;
    createdAt?: string;
    expiresAt?: string;
}

export const teamService = {
    // Check if user is owner/authorized
    checkPermission: async (): Promise<boolean> => {
        // Build logic or API call if needed, for now assume allowed or handle via 403
        return true;
    },

    getCollaborators: async (): Promise<Collaborator[]> => {
        const response = await client.get<ApiResponse<Collaborator[]>>(endpoints.collaborators.list);
        return response.data.data || [];
    },

    getInvitations: async (): Promise<Invitation[]> => {
        const response = await client.get<ApiResponse<Invitation[]>>(endpoints.collaborators.invitations);
        return response.data.data || [];
    },

    inviteCollaborator: async (email: string, role: string = 'COLLABORATOR'): Promise<void> => {
        await client.post(endpoints.collaborators.invite, { email, role });
    },

    revokeInvitation: async (id: string): Promise<void> => {
        await client.delete(endpoints.collaborators.revoke(id));
    },

    removeCollaborator: async (id: string): Promise<void> => {
        await client.delete(endpoints.collaborators.remove(id));
    },

    updateStatus: async (id: string, active: boolean): Promise<void> => {
        const endpoint = active
            ? endpoints.collaborators.activate(id)
            : endpoints.collaborators.deactivate(id);
        await client.patch(endpoint);
    }
};

export default teamService;
