import { Platform, TextStyle } from 'react-native';

const fontFamily = {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    bold: 'Outfit_700Bold',
    semiBold: 'Outfit_600SemiBold',
    mono: Platform.select({ ios: 'Courier New', android: 'monospace' }),
};

export const typography = {
    fontFamily,

    // Standardized font groupings
    weights: {
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
    },
    presets: {
        // Headings
        h1: {
            fontSize: 32,
            lineHeight: 40,
            fontFamily: fontFamily.bold,
            fontWeight: '700',
            letterSpacing: -0.5,
        } as TextStyle,
        h2: {
            fontSize: 24,
            lineHeight: 32,
            fontFamily: fontFamily.bold,
            fontWeight: '700',
            letterSpacing: -0.3,
        } as TextStyle,
        h3: {
            fontSize: 20,
            lineHeight: 28,
            fontFamily: fontFamily.bold,
            fontWeight: '700',
            letterSpacing: -0.2,
        } as TextStyle,
        h4: {
            fontSize: 18,
            lineHeight: 26,
            fontFamily: fontFamily.semiBold,
            fontWeight: '600',
            letterSpacing: -0.1,
        } as TextStyle,

        // Body
        bodyLarge: {
            fontSize: 18,
            lineHeight: 28,
            fontFamily: fontFamily.regular,
            fontWeight: '400',
        } as TextStyle,
        bodyMedium: {
            fontSize: 16,
            lineHeight: 24,
            fontFamily: fontFamily.regular,
            fontWeight: '400',
        } as TextStyle,
        bodySmall: {
            fontSize: 14,
            lineHeight: 20,
            fontFamily: fontFamily.regular,
            fontWeight: '400',
        } as TextStyle,

        // Utilities
        caption: {
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamily.medium,
            fontWeight: '500',
            color: '#64748b', // Default caption color usually
        } as TextStyle,
        button: {
            fontSize: 16,
            lineHeight: 24,
            fontFamily: fontFamily.medium,
            fontWeight: '600',
            letterSpacing: 0.5, // Uppercase buttons often need spacing, or even sentence case
        } as TextStyle,
    },
} as const;
