import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    HAPTICS_ENABLED: 'HPOTION_HAPTICS_ENABLED',
    NOTIFICATIONS_VIBRATION_ENABLED: 'HPOTION_NOTIFICATIONS_VIBRATION_ENABLED',
    EMERGENCY_ALERTS_ENABLED: 'HPOTION_EMERGENCY_ALERTS_ENABLED',
};

export const PreferencesService = {
    /**
     * Save the haptic feedback preference.
     */
    setHapticsEnabled: async (enabled: boolean): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.HAPTICS_ENABLED, JSON.stringify(enabled));
        } catch (error) {
            console.error('Error saving haptics preference:', error);
        }
    },

    /**
     * Get the haptic feedback preference. Defaults to true.
     */
    getHapticsEnabled: async (): Promise<boolean> => {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.HAPTICS_ENABLED);
            return value !== null ? JSON.parse(value) : true;
        } catch (error) {
            console.error('Error getting haptics preference:', error);
            return true;
        }
    },

    /**
     * Save the standard notifications vibration preference.
     */
    setNotificationsVibrationEnabled: async (enabled: boolean): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_VIBRATION_ENABLED, JSON.stringify(enabled));
        } catch (error) {
            console.error('Error saving notifications vibration preference:', error);
        }
    },

    /**
     * Get the standard notifications vibration preference. Defaults to true.
     */
    getNotificationsVibrationEnabled: async (): Promise<boolean> => {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_VIBRATION_ENABLED);
            return value !== null ? JSON.parse(value) : true;
        } catch (error) {
            console.error('Error getting notifications vibration preference:', error);
            return true;
        }
    },

    /**
     * Save the emergency alerts preference.
     */
    setEmergencyAlertsEnabled: async (enabled: boolean): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.EMERGENCY_ALERTS_ENABLED, JSON.stringify(enabled));
        } catch (error) {
            console.error('Error saving emergency alerts preference:', error);
        }
    },

    /**
     * Get the emergency alerts preference. Defaults to true.
     */
    getEmergencyAlertsEnabled: async (): Promise<boolean> => {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.EMERGENCY_ALERTS_ENABLED);
            return value !== null ? JSON.parse(value) : true;
        } catch (error) {
            console.error('Error getting emergency alerts preference:', error);
            return true;
        }
    }
};
