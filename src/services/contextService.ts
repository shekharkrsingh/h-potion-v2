import { client, ApiResponse } from './api/client';
import { endpoints } from './api/endpoints';
import { UserContextOption } from '@/types/entity';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ContextService = {
    async getAvailableContexts(): Promise<UserContextOption[]> {
        const res = await client.get<ApiResponse<UserContextOption[]>>(endpoints.contexts.list);
        return res.data.data;
    },

    async setActiveContext(entityId?: string, affiliationId?: string): Promise<void> {
        await client.put(endpoints.contexts.setActive, { entityId, affiliationId });
        if (entityId) {
            await AsyncStorage.setItem('activeEntityId', entityId);
        } else {
            await AsyncStorage.removeItem('activeEntityId');
        }
        if (affiliationId) {
            await AsyncStorage.setItem('activeAffiliationId', affiliationId);
        } else {
            await AsyncStorage.removeItem('activeAffiliationId');
        }
    },
};
