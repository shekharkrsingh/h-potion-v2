import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { spacing } from '@/theme/spacing';
import { getGlassStyle } from '@/styles/common';
import { useTheme } from '@/theme/ThemeContext';

/**
 * Skeleton loaders specifically for Dashboard components to maintain layout during fetch.
 */

import { createStyles } from '@/styles/components/dashboard/DashboardSkeletons.styles';

import { radius } from '@/theme/radius';

export const StatsCardSkeleton = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={[styles.statsCard, getGlassStyle(theme)]}>
            <Skeleton circle width={40} height={40} style={{ marginBottom: spacing.s }} />
            <Skeleton width="60%" height={24} style={{ marginBottom: spacing.xs }} />
            <Skeleton width="40%" height={16} />
        </View>
    );
};

export const AppointmentCardSkeleton = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={[styles.appointmentCard, getGlassStyle(theme)]}>
            <View style={styles.timeSection}>
                <Skeleton width={40} height={18} style={{ marginBottom: 4 }} />
                <Skeleton width={30} height={12} />
            </View>
            <View style={styles.detailsSection}>
                <Skeleton width="70%" height={18} style={{ marginBottom: 8 }} />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Skeleton width={60} height={16} borderRadius={4} />
                    <Skeleton width={80} height={16} borderRadius={4} />
                </View>
            </View>
        </View>
    );
};

export const PerformanceMetricsSkeleton = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.metricsContainer}>
            <Skeleton width={150} height={20} style={{ marginBottom: spacing.m }} />
            <View style={styles.metricsGrid}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={[styles.metricItem, getGlassStyle(theme)]}>
                        <Skeleton circle width={30} height={30} style={{ marginBottom: 8 }} />
                        <Skeleton width="60%" height={20} style={{ marginBottom: 4 }} />
                        <Skeleton width="40%" height={12} />
                    </View>
                ))}
            </View>
        </View>
    );
};

export const QuickActionsSkeleton = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.quickActionsContainer}>
            <Skeleton width={120} height={20} style={{ marginBottom: spacing.m }} />
            <View style={styles.quickActionsGrid}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={styles.quickActionItem}>
                        <Skeleton width={50} height={50} borderRadius={12} style={{ marginBottom: 8 }} />
                        <Skeleton width={60} height={12} />
                    </View>
                ))}
            </View>
        </View>
    );
};

export const ChartsSkeleton = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={[styles.chartsContainer, getGlassStyle(theme)]}>
            <Skeleton width={100} height={20} style={{ marginBottom: spacing.m }} />
            <Skeleton width="100%" height={240} borderRadius={radius.l} />
        </View>
    );
};

export const UpcomingAppointmentsSkeleton = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.upcomingContainer}>
            <Skeleton width={180} height={20} style={{ marginBottom: spacing.m }} />
            {[1, 2, 3].map((i) => (
                <AppointmentCardSkeleton key={i} />
            ))}
        </View>
    );
};
export const RecentActivitySkeleton = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    return (
        <View style={styles.upcomingContainer}>
            <Skeleton width={140} height={20} style={{ marginBottom: spacing.m }} />
            <View style={[styles.appointmentCard, getGlassStyle(theme), { padding: spacing.m, flexDirection: 'column' }]}>
                {[1, 2, 3].map((i) => (
                    <View key={i} style={{ flexDirection: 'row', gap: 12, marginBottom: i === 3 ? 0 : 20 }}>
                        <Skeleton circle width={10} height={10} style={{ marginTop: 4 }} />
                        <View style={{ flex: 1 }}>
                            <Skeleton width="80%" height={16} style={{ marginBottom: 6 }} />
                            <Skeleton width="40%" height={12} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
