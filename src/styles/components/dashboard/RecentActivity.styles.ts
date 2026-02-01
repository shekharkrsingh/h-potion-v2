import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

// Helper for dot color - exported separately to keep StyleSheet clean
export const getDotColor = (theme: ColorTheme, isRead: boolean) => {
    return isRead ? theme.border.subtle : theme.palette.primary[500];
};

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        paddingHorizontal: spacing.m,
        paddingTop: spacing.m,
    },
    card: {
        ...getGlassStyle(theme),
        borderRadius: radius.l,
        padding: spacing.m,
    },
    activityItem: {
        flexDirection: 'row',
        marginBottom: spacing.m,
    },
    timelineContainer: {
        alignItems: 'center',
        marginRight: spacing.s,
        width: 12,
    },
    timelineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        zIndex: 1,
    },
    timelineLine: {
        flex: 1,
        width: 1,
        backgroundColor: theme.border.subtle,
        marginTop: 4,
    },
    contentContainer: {
        flex: 1,
        paddingBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    message: {
        fontSize: 12,
        color: theme.text.secondary,
        marginBottom: 4,
    },
    time: {
        fontSize: 10,
        color: theme.text.tertiary,
    },
    viewAllButton: {
        alignItems: 'center',
        marginTop: spacing.s,
        paddingTop: spacing.m,
        borderTopWidth: 1,
        borderTopColor: theme.border.subtle,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.palette.primary[600],
    },
});
