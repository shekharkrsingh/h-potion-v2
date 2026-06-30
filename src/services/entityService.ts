import { client, ApiResponse } from './api/client';
import { endpoints } from './api/endpoints';
import { HealthcareEntity, EntityMember, EntityMemberRole } from '@/types/entity';

export interface CreateEntityPayload {
    name: string;
    type: string;
    registrationNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phoneNumber?: string;
    email?: string;
    departments?: string[];
}

export interface AddMemberPayload {
    userId: string;
    role: EntityMemberRole;
    email?: string;
    displayName?: string;
    permissions?: string[];
    departmentIds?: string[];
}

export const EntityService = {
    async createEntity(payload: CreateEntityPayload): Promise<HealthcareEntity> {
        const res = await client.post<ApiResponse<HealthcareEntity>>(endpoints.entities.create, payload);
        return res.data.data;
    },

    async getEntity(entityId: string): Promise<HealthcareEntity> {
        const res = await client.get<ApiResponse<HealthcareEntity>>(endpoints.entities.get(entityId));
        return res.data.data;
    },

    async updateEntity(entityId: string, payload: Partial<CreateEntityPayload>): Promise<HealthcareEntity> {
        const res = await client.put<ApiResponse<HealthcareEntity>>(endpoints.entities.update(entityId), payload);
        return res.data.data;
    },

    async searchEntities(name?: string, city?: string): Promise<HealthcareEntity[]> {
        const params: Record<string, string> = {};
        if (name) params.name = name;
        if (city) params.city = city;
        const res = await client.get<ApiResponse<HealthcareEntity[]>>(endpoints.entities.search, { params });
        return res.data.data;
    },

    async addMember(entityId: string, payload: AddMemberPayload): Promise<HealthcareEntity> {
        const res = await client.post<ApiResponse<HealthcareEntity>>(endpoints.entities.addMember(entityId), payload);
        return res.data.data;
    },

    async updateMemberRole(entityId: string, userId: string, role: EntityMemberRole): Promise<HealthcareEntity> {
        const res = await client.put<ApiResponse<HealthcareEntity>>(
            endpoints.entities.updateMemberRole(entityId, userId),
            undefined,
            { params: { role } }
        );
        return res.data.data;
    },

    async removeMember(entityId: string, userId: string): Promise<HealthcareEntity> {
        const res = await client.delete<ApiResponse<HealthcareEntity>>(endpoints.entities.removeMember(entityId, userId));
        return res.data.data;
    },
};
