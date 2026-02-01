import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';

// Helper for dynamic icon box background
export const getIconBoxBackground = (colorKey: string, mode: string) => {
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
    container: {
        marginBottom: spacing.l,
        paddingHorizontal: spacing.l,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.m,
    },
    actionItem: {
        flex: 1,
        minWidth: '30%',
        ...getGlassStyle(theme),
        borderRadius: radius.l,
        alignItems: 'center',
        padding: spacing.m,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: radius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.s,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    }
});
