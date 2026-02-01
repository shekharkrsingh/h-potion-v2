import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export const createNotificationItemStyles = (theme: ColorTheme) => StyleSheet.create({
    hiddenContainer: {
        overflow: 'hidden'
    },
    notificationItem: {
        padding: spacing.m,
        marginBottom: 8,
        borderRadius: radius.l,
        borderWidth: 0, // No border by default for read items
        // Professional Glassmorphism
        backgroundColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.65)',
        shadowColor: theme.palette.neutral[900],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: theme.mode === 'dark' ? 0.4 : 0.08,
        shadowRadius: 16,
    },
    notificationHeaderRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    expandedContent: {
        marginTop: spacing.m, // More breathing room
        paddingLeft: 52,
        paddingRight: spacing.s,
    },
    unreadItem: {
        backgroundColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: theme.palette.primary[500] + '40', // Subtle primary tint on border
        borderWidth: 1,
    },
    // Type specific borders - refined widths
    type_system: {
        borderLeftColor: theme.palette.neutral[500],
        borderLeftWidth: 3,
    },
    type_update: {
        borderLeftColor: theme.palette.primary[500],
        borderLeftWidth: 3,
    },
    type_alert: {
        borderLeftColor: theme.palette.warning[500],
        borderLeftWidth: 3,
    },
    type_emergency: {
        borderLeftColor: theme.palette.error[500],
        borderLeftWidth: 3,
    },
    type_support: {
        borderLeftColor: theme.palette.secondary[500],
        borderLeftWidth: 3,
    },
    type_info: {
        borderLeftColor: theme.palette.info[500],
        borderLeftWidth: 3,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12, // Softer square look (squircle-ish) instead of circle
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', // Subtle contrast
    },
    textContainer: {
        flex: 1,
    },
    timeText: {
        marginTop: 6,
        fontSize: 11,
        color: theme.text.tertiary,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.palette.primary[500],
        marginTop: 4, // Align better with text
        shadowColor: theme.palette.primary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    unreadTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    messagePreview: {
        marginTop: 4,
        lineHeight: 18,
    },
    messageFull: {
        lineHeight: 22,
        fontSize: 14,
    },
    expandedIconContainer: {
        alignItems: 'center',
        marginTop: 12,
        opacity: 0.7,
    },
});
