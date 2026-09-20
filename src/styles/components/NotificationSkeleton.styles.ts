import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export const createSkeletonStyles = (theme: ColorTheme) => StyleSheet.create({
    listContent: {
        padding: spacing.l,
        paddingBottom: spacing.xxl,
    },
    notificationItem: {
        padding: spacing.m,
        marginBottom: 8,
        borderRadius: radius.l,
        borderWidth: 0,
        // Professional Glassmorphism
        backgroundColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.65)',
        shadowColor: theme.palette.neutral[900],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: theme.mode === 'dark' ? 0.4 : 0.08,
        shadowRadius: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSkeleton: {
        marginRight: spacing.m,
    },
    textContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
});
