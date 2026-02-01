import { client, ApiResponse } from './api/client';
import { endpoints } from './api/endpoints';
import { checkAndSendDailyAnalytics } from './analytics/analyticsService';

export interface RuntimeConfig {
    id: string;
    minVersion: string;
    latestVersion: string;
    appWebUrl: string;
    googlePlayStoreUrl: string;
    applePlayStoreUrl: string;
    appName: string;
    appSlogan: string;
    supportEmail: string;
    updatedAt: string;
}

export const ConfigService = {
    fetchRuntimeConfig: async (): Promise<RuntimeConfig> => {
        // Call runtime config and analytics in parallel
        const [response] = await Promise.all([
            client.get<ApiResponse<RuntimeConfig>>(endpoints.auth.runtime),
            checkAndSendDailyAnalytics().catch(err => {
                console.warn('[ConfigService] Analytics failed, but continuing:', err);
            })
        ]);

        return response.data.data;
    }
};
