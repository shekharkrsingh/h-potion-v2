import React from 'react';
import { View } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { styles } from '@/styles/components/dashboard/PerformanceMetrics.styles';
import { CountUpText } from '@/components/ui/CountUpText';
import { PerformanceMetricsSkeleton } from './DashboardSkeletons';

interface Statistics {
    lastActiveDayAppointments?: number;
    lastActiveDayTreatedAppointments?: number;
    lastActiveDayPercentageTreatedAppointments?: number;
}

interface PerformanceMetricsProps {
    statistics?: Statistics;
    isLoading?: boolean;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ statistics, isLoading }) => {
    const { theme } = useTheme();

    if (isLoading) return <PerformanceMetricsSkeleton />;

    const successRate = statistics?.lastActiveDayPercentageTreatedAppointments !== undefined
        ? Math.round(statistics.lastActiveDayPercentageTreatedAppointments) + "%"
        : statistics?.lastActiveDayAppointments && statistics.lastActiveDayTreatedAppointments
            ? Math.round((statistics.lastActiveDayTreatedAppointments / statistics.lastActiveDayAppointments) * 100) + "%"
            : "0%";

    const metrics = [
        {
            label: "Last Active",
            value: statistics?.lastActiveDayAppointments || 0,
            color: theme.text.primary,
            bgColor: theme.background.card,
        },
        {
            label: "Treated",
            value: statistics?.lastActiveDayTreatedAppointments || 0,
            color: theme.text.primary,
            bgColor: theme.background.card,
        },
        {
            label: "Success Rate",
            value: successRate,
            color: theme.status.success,
            bgColor: theme.status.successBg,
        },
    ];

    return (
        <View style={styles.container}>
            <SectionHeader title="Daily Performance" />
            <View style={styles.grid}>
                {metrics.map((metric, index) => (
                    <View
                        key={index}
                        style={[styles.metricItem, { backgroundColor: metric.bgColor }]}
                    >
                        {(() => {
                            const valStr = metric.value.toString();
                            const numericStr = valStr.replace(/[^0-9.]/g, '');
                            const numericVal = parseFloat(numericStr);
                            const suffix = valStr.includes('%') ? '%' : '';

                            if (!isNaN(numericVal)) {
                                return (
                                    <CountUpText
                                        value={numericVal}
                                        suffix={suffix}
                                        style={[styles.value, { color: metric.color }]}
                                    />
                                );
                            }
                            return (
                                <Text style={[styles.value, { color: metric.color }]}>
                                    {metric.value}
                                </Text>
                            );
                        })()}
                        <Text style={styles.label} color={theme.text.secondary}>
                            {metric.label}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};
