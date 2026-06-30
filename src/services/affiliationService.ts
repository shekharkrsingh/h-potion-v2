import { client, ApiResponse } from './api/client';
import { endpoints } from './api/endpoints';
import { EntityAffiliation, DayAvailability, ConflictCheckResult, DataSharingPolicy } from '@/types/entity';

export interface InitiateAffiliationPayload {
    entityId: string;
    doctorId: string;
    initiatedBy: 'DOCTOR' | 'ENTITY';
    department?: string;
    entityAvailability?: DayAvailability[];
    dataSharingPolicy?: DataSharingPolicy;
}

export const AffiliationService = {
    async list(): Promise<EntityAffiliation[]> {
        const res = await client.get<ApiResponse<EntityAffiliation[]>>(endpoints.affiliations.list);
        return res.data.data;
    },

    async get(id: string): Promise<EntityAffiliation> {
        const res = await client.get<ApiResponse<EntityAffiliation>>(endpoints.affiliations.get(id));
        return res.data.data;
    },

    async initiate(payload: InitiateAffiliationPayload): Promise<EntityAffiliation> {
        const res = await client.post<ApiResponse<EntityAffiliation>>(endpoints.affiliations.initiate, payload);
        return res.data.data;
    },

    async accept(id: string): Promise<EntityAffiliation> {
        const res = await client.put<ApiResponse<EntityAffiliation>>(endpoints.affiliations.accept(id));
        return res.data.data;
    },

    async reject(id: string, reason: string): Promise<EntityAffiliation> {
        const res = await client.put<ApiResponse<EntityAffiliation>>(endpoints.affiliations.reject(id), { reason });
        return res.data.data;
    },

    async suspend(id: string, reason: string): Promise<EntityAffiliation> {
        const res = await client.put<ApiResponse<EntityAffiliation>>(endpoints.affiliations.suspend(id), { reason });
        return res.data.data;
    },

    async terminate(id: string, reason: string): Promise<EntityAffiliation> {
        const res = await client.put<ApiResponse<EntityAffiliation>>(endpoints.affiliations.terminate(id), { reason });
        return res.data.data;
    },

    async getAvailability(id: string): Promise<DayAvailability[]> {
        const res = await client.get<ApiResponse<DayAvailability[]>>(endpoints.affiliations.availability(id));
        return res.data.data;
    },

    async updateAvailability(id: string, availability: DayAvailability[]): Promise<DayAvailability[]> {
        const res = await client.put<ApiResponse<DayAvailability[]>>(endpoints.affiliations.availability(id), { availability });
        return res.data.data;
    },

    async checkConflicts(id: string): Promise<ConflictCheckResult> {
        const res = await client.get<ApiResponse<ConflictCheckResult>>(endpoints.affiliations.conflictCheck(id));
        return res.data.data;
    },

    async updateDataSharing(id: string, payload: { doctorSharedFields: string[]; entitySharedFields: string[] }): Promise<void> {
        await client.put(endpoints.affiliations.dataSharing(id), payload);
    },
};
