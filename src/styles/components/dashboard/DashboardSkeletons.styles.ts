import { StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { ColorTheme } from '@/theme/colors';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    statsCard: {
        flex: 1,
        padding: spacing.m,
        borderRadius: radius.l,
        minWidth: '45%',
        minHeight: 120, // Match StatsCard actual minHeight
    },
    appointmentCard: {
        flexDirection: 'row',
        padding: spacing.m,
        borderRadius: radius.l,
        marginBottom: spacing.m,
        alignItems: 'center',
        minHeight: 80, // Match typical AppointmentCard height
    },
    timeSection: {
        width: 60,
        paddingRight: spacing.m,
        borderRightWidth: 1,
        borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        marginRight: spacing.m,
        alignItems: 'center',
    },
    detailsSection: {
        flex: 1,
    },
    metricsContainer: {
        paddingHorizontal: spacing.l, // Match PerformanceMetrics padding
        marginBottom: spacing.l,
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: spacing.m,
    },
    metricItem: {
        flex: 1,
        padding: spacing.m,
        borderRadius: radius.l,
        alignItems: 'center',
        minHeight: 100,
    },
    quickActionsContainer: {
        paddingHorizontal: spacing.l, // Match QuickActions padding
        marginBottom: spacing.l,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        gap: spacing.m,
    },
    quickActionItem: {
        flex: 1,
        alignItems: 'center',
    },
    chartsContainer: {
        marginHorizontal: spacing.l, // Match ChartsSection padding
        padding: spacing.m,
        borderRadius: radius.l, // Match chartWidth radius.l
        marginBottom: spacing.l,
    },
    upcomingContainer: {
        paddingHorizontal: spacing.l,
        marginBottom: spacing.l,
    }
});
