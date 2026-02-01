import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const layout = {
    window: {
        width,
        height,
    },
    isSmallDevice: width < 375,

    // Component specific layout sizing
    hitSlop: { top: 10, left: 10, bottom: 10, right: 10 },

    // Common sizes
    headerHeight: Platform.select({ ios: 44, android: 56, default: 64 }),
    bottomTabHeight: Platform.select({ ios: 88, default: 60 }),

    // Input heights
    inputHeight: 48,
    buttonHeight: 48,

    // Icon sizes
    icon: {
        xs: 12,
        s: 16,
        m: 24,   // Standard icon size
        l: 32,
        xl: 48,
    },
} as const;
