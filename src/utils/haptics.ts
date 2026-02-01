import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let isEnabled = true;

/**
 * A utility to provide haptic feedback using expo-haptics.
 */
export const haptics = {
    /**
     * Update the haptics enabled state.
     */
    setEnabled: (enabled: boolean) => {
        isEnabled = enabled;
    },

    /**
     * A very light, short vibration for standard button taps.
     */
    selection: () => {
        if (!isEnabled) return;
        Haptics.selectionAsync().catch(() => { });
    },

    /**
     * A slightly stronger impact for successful or important actions.
     */
    impact: (force = false) => {
        if (!isEnabled && !force) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => { });
    },

    /**
     * Success notification pattern.
     */
    success: () => {
        if (!isEnabled) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
    },

    /**
     * Error notification pattern.
     */
    error: () => {
        if (!isEnabled) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => { });
    },

    /**
     * Warning notification pattern.
     */
    warning: () => {
        if (!isEnabled) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => { });
    }
};
