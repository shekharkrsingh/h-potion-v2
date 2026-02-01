import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';

export const createModalComponentStyles = (theme: ColorTheme) => StyleSheet.create({
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.m,
        borderRadius: radius.m,
        backgroundColor: theme.mode === 'light' ? theme.palette.primary[50] : 'rgba(14, 165, 233, 0.1)',
        borderColor: theme.palette.primary[300],
        borderWidth: 1,
        marginBottom: spacing.l,
        gap: 8,
    },
    inputRow: {
        flexDirection: 'row',
        gap: spacing.m,
        marginBottom: spacing.m,
    },
    flex1: {
        flex: 1,
    },
    footer: {
        marginTop: spacing.xl,
        gap: spacing.m,
    },
    // Adding extra aesthetic touches like subtle glows for primary buttons
    primaryButtonGlow: {
        shadowColor: theme.palette.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    }
});
