import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyticsStorageData } from './analyticsTypes';

const ANALYTICS_STORAGE_KEY = '@analytics_tracking';

/**
 * Get the last date analytics were sent
 * @returns ISO date string (YYYY-MM-DD) or null if never sent
 */
export const getLastAnalyticsDate = async (): Promise<string | null> => {
    try {
        const data = await AsyncStorage.getItem(ANALYTICS_STORAGE_KEY);
        if (data) {
            const parsed: AnalyticsStorageData = JSON.parse(data);
            return parsed.lastSentDate;
        }
        return null;
    } catch (error) {
        console.error('[Analytics] Error reading last analytics date:', error);
        return null;
    }
};

/**
 * Set the last date analytics were sent
 * @param date ISO date string (YYYY-MM-DD)
 */
export const setLastAnalyticsDate = async (date: string): Promise<void> => {
    try {
        const data: AnalyticsStorageData = {
            lastSentDate: date,
        };
        await AsyncStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('[Analytics] Error saving last analytics date:', error);
    }
};

/**
 * Clear analytics storage (for testing/debugging)
 */
export const clearAnalyticsDate = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(ANALYTICS_STORAGE_KEY);
    } catch (error) {
        console.error('[Analytics] Error clearing analytics date:', error);
    }
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export const getTodayDateString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};
