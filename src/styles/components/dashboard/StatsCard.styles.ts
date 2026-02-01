import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';

// Helper for dynamic icon background - exported separately to keep StyleSheet clean
export const getIconBackground = (colorKey: string, mode: string) => {
    const colors: Record<string, string> = {
        primary: '59, 130, 246',
        secondary: '16, 185, 129',
        info: '14, 165, 233',
        warning: '245, 158, 11',
    };
    const rgb = colors[colorKey] || colors.primary;
    return mode === 'dark' ? `rgba(${rgb}, 0.1)` : `rgba(${rgb}, 0.08)`;
};

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: radius.l,
        padding: spacing.m,
        ...getGlassStyle(theme),
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    label: {
        fontSize: 12,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.s,
    },
    trendText: {
        fontSize: 10,
        marginLeft: 4,
    },
});
