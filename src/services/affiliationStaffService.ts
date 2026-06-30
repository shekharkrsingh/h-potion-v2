import { client, ApiResponse } from './api/client';
import { endpoints } from './api/endpoints';
import { AffiliationStaffAssignment, StaffAssignmentScope, StaffAssigner } from '@/types/entity';

export interface AssignStaffPayload {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    scope: StaffAssignmentScope;
    assignedBy: StaffAssigner;
    permissions?: string[];
}

export const AffiliationStaffService = {
    async list(affiliationId: string): Promise<AffiliationStaffAssignment[]> {
        const res = await client.get<ApiResponse<AffiliationStaffAssignment[]>>(endpoints.affiliations.staff(affiliationId));
        return res.data.data;
    },

    async assign(affiliationId: string, payload: AssignStaffPayload): Promise<AffiliationStaffAssignment> {
        const res = await client.post<ApiResponse<AffiliationStaffAssignment>>(
            endpoints.affiliations.staff(affiliationId),
            payload
        );
        return res.data.data;
    },

    async revoke(affiliationId: string, userId: string): Promise<void> {
        await client.delete(endpoints.affiliations.revokeStaff(affiliationId, userId));
    },
};
