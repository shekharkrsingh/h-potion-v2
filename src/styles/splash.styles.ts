import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';

const { width, height } = Dimensions.get('window');

export const getSplashGradient = (theme: ColorTheme) => {
    if (theme.mode === 'dark') {
        return [
            theme.palette.secondary[900],
            theme.palette.primary[800],
            theme.palette.info[900]
        ] as const;
    }
    // Professional Light Medical Gradient
    return [
        '#f0f9ff',
        '#e0f2fe',
        '#bae6fd'
    ] as const;
};

export const createStyles = (theme: ColorTheme) => {
    const isDark = theme.mode === 'dark';
    const textColor = isDark ? theme.palette.neutral[0] : theme.palette.primary[800];
    const accentColor = isDark ? theme.palette.neutral[0] : theme.palette.primary[600];

    return StyleSheet.create({
        gradientContainer: {
            flex: 1,
            width: width,
            height: height,
            justifyContent: 'center',
            alignItems: 'center',
        },
        contentContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
        },
        logoContainer: {
            marginBottom: spacing.xxl,
            shadowColor: isDark ? theme.palette.neutral[950] : theme.palette.primary[700],
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 20,
            elevation: 10,
        },
        logo: {
            width: 120,
            height: 120,
            tintColor: isDark ? theme.palette.neutral[0] : theme.palette.primary[600],
        },
        textContainer: {
            alignItems: 'center',
            marginBottom: spacing.xxl * 2,
        },
        appName: {
            marginTop: spacing.m,
            fontSize: 36,
            fontWeight: 'bold',
            color: textColor,
            letterSpacing: 2,
        },
        tagline: {
            marginTop: spacing.xs,
            fontSize: 14,
            color: textColor,
            opacity: 0.8,
            letterSpacing: 1,
            fontWeight: '500',
        },
        loadingContainer: {
            position: 'absolute',
            bottom: height * 0.15,
            width: '70%',
            alignItems: 'center',
        },
        loadingBarBackground: {
            width: '100%',
            height: 6,
            backgroundColor: accentColor,
            opacity: 0.2,
            borderRadius: 3,
            overflow: 'hidden',
        },
        loadingBarFill: {
            height: '100%',
            backgroundColor: accentColor,
            borderRadius: 3,
        },
        loadingText: {
            marginTop: spacing.s,
            color: textColor,
            opacity: 0.7,
            fontSize: 12,
            fontWeight: '600',
        }
    });
};

