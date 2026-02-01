import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PreferencesService } from '@/services/preferencesService';
import { haptics } from '@/utils/haptics';

interface UserSettingsState {
    hapticsEnabled: boolean;
    notificationsVibrationEnabled: boolean;
    emergencyAlertsEnabled: boolean;
    isInitialized: boolean;
}

const initialState: UserSettingsState = {
    hapticsEnabled: true,
    notificationsVibrationEnabled: true,
    emergencyAlertsEnabled: true,
    isInitialized: false,
};

/**
 * Initialize settings from local storage
 */
export const initializeUserSettings = createAsyncThunk(
    'userSettings/initialize',
    async () => {
        const [hapticsEnabled, notificationsVibrationEnabled, emergencyAlertsEnabled] = await Promise.all([
            PreferencesService.getHapticsEnabled(),
            PreferencesService.getNotificationsVibrationEnabled(),
            PreferencesService.getEmergencyAlertsEnabled()
        ]);

        // Sync haptics utility
        haptics.setEnabled(hapticsEnabled);

        return { hapticsEnabled, notificationsVibrationEnabled, emergencyAlertsEnabled };
    }
);

/**
 * Toggle haptics and persist to local storage
 */
export const toggleHaptics = createAsyncThunk(
    'userSettings/toggleHaptics',
    async (enabled: boolean) => {
        await PreferencesService.setHapticsEnabled(enabled);
        haptics.setEnabled(enabled);
        return enabled;
    }
);

/**
 * Toggle standard notifications vibration and persist
 */
export const toggleNotificationsVibration = createAsyncThunk(
    'userSettings/toggleNotificationsVibration',
    async (enabled: boolean) => {
        await PreferencesService.setNotificationsVibrationEnabled(enabled);
        return enabled;
    }
);

/**
 * Toggle emergency alerts and persist
 */
export const toggleEmergencyAlerts = createAsyncThunk(
    'userSettings/toggleEmergencyAlerts',
    async (enabled: boolean) => {
        await PreferencesService.setEmergencyAlertsEnabled(enabled);
        return enabled;
    }
);

const userSettingsSlice = createSlice({
    name: 'userSettings',
    initialState,
    reducers: {
        setHapticsEnabled: (state, action: PayloadAction<boolean>) => {
            state.hapticsEnabled = action.payload;
            haptics.setEnabled(action.payload);
        },
        setNotificationsVibrationEnabled: (state, action: PayloadAction<boolean>) => {
            state.notificationsVibrationEnabled = action.payload;
        },
        setEmergencyAlertsEnabled: (state, action: PayloadAction<boolean>) => {
            state.emergencyAlertsEnabled = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeUserSettings.fulfilled, (state, action) => {
                state.hapticsEnabled = action.payload.hapticsEnabled;
                state.notificationsVibrationEnabled = action.payload.notificationsVibrationEnabled;
                state.emergencyAlertsEnabled = action.payload.emergencyAlertsEnabled;
                state.isInitialized = true;
            })
            .addCase(toggleHaptics.fulfilled, (state, action) => {
                state.hapticsEnabled = action.payload;
            })
            .addCase(toggleNotificationsVibration.fulfilled, (state, action) => {
                state.notificationsVibrationEnabled = action.payload;
            })
            .addCase(toggleEmergencyAlerts.fulfilled, (state, action) => {
                state.emergencyAlertsEnabled = action.payload;
            });
    },
});

export const {
    setHapticsEnabled,
    setNotificationsVibrationEnabled,
    setEmergencyAlertsEnabled
} = userSettingsSlice.actions;
export default userSettingsSlice.reducer;
