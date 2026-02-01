import * as Device from 'expo-device';
import Constants from 'expo-constants';
import NetInfo from '@react-native-community/netinfo';
import { Dimensions, Platform } from 'react-native';
import * as ExpoLocation from 'expo-location';
import { client } from '@/services/api/client'; // Updated import
import { POST_ANALYTICS_TRACK } from './analyticsEndpoints';
import { AnalyticsDTO } from './analyticsTypes';
import {
    getTodayDateString,
    getLastAnalyticsDate,
    setLastAnalyticsDate
} from './analyticsStorage';

/**
 * Collects all relevant device metadata and GPS coordinates
 */
const collectDeviceMetadata = async (): Promise<AnalyticsDTO> => {
    try {
        // 1. Get location permission and coordinates
        let latitude: number | undefined;
        let longitude: number | undefined;

        try {
            const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                // Get location with a timeout to avoid hanging if GPS is slow
                const locationPromise = ExpoLocation.getCurrentPositionAsync({
                    accuracy: ExpoLocation.Accuracy.Balanced,
                });

                const timeoutPromise = new Promise<null>((resolve) =>
                    setTimeout(() => resolve(null), 5000)
                );

                const location: any = await Promise.race([locationPromise, timeoutPromise]);

                if (location && typeof location === 'object' && 'coords' in location) {
                    latitude = location.coords.latitude;
                    longitude = location.coords.longitude;
                } else {
                    // GPS collection timed out or failed
                }
            } else {
                // Location permission denied, falling back to IP geolocation
            }
        } catch (error) {
            console.warn('[Analytics] Error requesting location permissions:', error);
        }

        const networkInfo = await NetInfo.fetch();

        return {
            platform: Platform.OS,
            osVersion: Platform.Version.toString(),
            appVersion: Constants.expoConfig?.version || '0.0.1',
            deviceManufacturer: Device.manufacturer || undefined,
            deviceModel: Device.modelName || undefined,
            deviceBrand: Device.brand || undefined,
            screenWidth: Math.round(Dimensions.get('window').width),
            screenHeight: Math.round(Dimensions.get('window').height),
            networkType: networkInfo.type,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
            latitude,
            longitude
        };
    } catch (error) {
        console.error('[Analytics] Error collecting metadata:', error);
        // Return minimal data if collection fails
        return {
            platform: Platform.OS,
            osVersion: Platform.Version.toString(),
            appVersion: '0.0.1',
            screenWidth: 0,
            screenHeight: 0,
            networkType: 'unknown',
            timezone: 'unknown',
        };
    }
};

/**
 * Send analytics metadata to the backend
 */
const sendAnalyticsToBackend = async (metadata: AnalyticsDTO): Promise<boolean> => {
    try {
        const response = await client.post(POST_ANALYTICS_TRACK, metadata); // Using axios client directly
        return response.status === 200;
    } catch (error) {
        console.error('[Analytics] Failed to send analytics:', error);
        return false;
    }
};

/**
 * Main entry point: Check if analytics should be sent today and if so, send them.
 * This should be called once on app startup.
 */
export const checkAndSendDailyAnalytics = async (): Promise<void> => {
    try {
        const today = getTodayDateString();
        const lastSentDate = await getLastAnalyticsDate();

        // If we already sent analytics today, skip
        if (lastSentDate === today) {
            return;
        }

        // Collect metadata
        const metadata = await collectDeviceMetadata();

        // Send to backend
        const success = await sendAnalyticsToBackend(metadata);

        if (success) {
            // Update local storage flag only on success
            await setLastAnalyticsDate(today);
        }
    } catch (error) {
        // Analytics should never break the app flow
        console.error('[Analytics] Error in daily analytics check:', error);
    }
};
