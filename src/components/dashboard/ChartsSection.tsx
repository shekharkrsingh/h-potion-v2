import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { createStyles } from '@/styles/components/dashboard/ChartsSection.styles';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { SectionHeader } from './SectionHeader';

const screenWidth = Dimensions.get('window').width;
// Adjust for padding (16 * 2 for screen padding + 16 * 2 for card padding)
const chartWidth = screenWidth - 64 - 32;

import { ChartsSkeleton } from './DashboardSkeletons';

interface Statistics {
    lastWeekTreatedData?: Array<{ date: string; count: number }>;
    totalTreatedAppointment?: number;
    totalAvailableAtClinic?: number;
    totalUntreatedAppointmentAndNotAvailable?: number;
}

interface ChartsSectionProps {
    statistics?: Statistics;
    isLoading?: boolean;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ statistics, isLoading }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    if (isLoading) return <ChartsSkeleton />;

    const lineChartData = useMemo(() => {
        if (!statistics?.lastWeekTreatedData || statistics.lastWeekTreatedData.length === 0) {
            return [];
        }

        return statistics.lastWeekTreatedData.map((item) => {
            const date = new Date(item.date);
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });

            return {
                value: item.count,
                label: dayLabel,
                labelTextStyle: {
                    color: theme.text.secondary,
                    fontSize: 10,
                },
            };
        });
    }, [statistics?.lastWeekTreatedData, theme]);

    const pieChartData = useMemo(() => {
        const treated = statistics?.totalTreatedAppointment || 0;
        const available = statistics?.totalAvailableAtClinic || 0;
        const pending = statistics?.totalUntreatedAppointmentAndNotAvailable || 0;

        const total = treated + available + pending;

        if (total === 0) return [];

        return [
            {
                value: treated,
                color: theme.status.success,
                gradientCenterColor: theme.mode === 'dark' ? '#16a34a' : '#4ade80',
                text: treated ? `${Math.round((treated / total) * 100)}%` : '',
                textColor: theme.text.inverted,
                focused: true,
            },
            {
                value: available,
                color: theme.palette.primary[500],
                gradientCenterColor: theme.palette.primary[400],
                text: available ? `${Math.round((available / total) * 100)}%` : '',
                textColor: theme.text.inverted,
            },
            {
                value: pending,
                color: theme.status.warning,
                gradientCenterColor: theme.mode === 'dark' ? '#d97706' : '#fbce6b',
                text: pending ? `${Math.round((pending / total) * 100)}%` : '',
                textColor: theme.text.inverted,
            },
        ].filter(item => item.value > 0);
    }, [statistics, theme]);


    if (!statistics) return null;

    const totalPatients = pieChartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <View style={styles.container}>
            {lineChartData.length > 0 && (
                <View style={styles.chartContainer}>
                    <Text weight="bold" color={theme.palette.primary[500]} style={styles.chartTitle}>Weekly Trend</Text>
                    <View style={styles.chartWrapper}>
                        <LineChart
                            data={lineChartData}
                            width={chartWidth}
                            height={220}
                            spacing={44}
                            color={theme.palette.primary[500]}
                            thickness={4}
                            startFillColor={theme.palette.primary[500]}
                            endFillColor={theme.palette.primary[50]}
                            startOpacity={0.2}
                            endOpacity={0.02}
                            initialSpacing={10}
                            noOfSections={4}
                            yAxisColor="transparent"
                            xAxisColor={theme.border.subtle}
                            rulesColor={theme.border.subtle}
                            yAxisTextStyle={{ color: theme.text.secondary, fontSize: 10 }}
                            curved
                            areaChart
                            isAnimated
                            pointerConfig={{
                                pointerColor: theme.palette.primary[500],
                                radius: 6,
                                pointerStripColor: theme.palette.primary[500],
                                pointerStripWidth: 2,
                                pointerStripUptoDataPoint: true,
                                pointerLabelComponent: (items: any) => {
                                    if (!items || items.length === 0) return null;
                                    return (
                                        <View style={styles.tooltipContainer}>
                                            <Text weight="bold" style={styles.tooltipValue}>
                                                {items[0].value}
                                            </Text>
                                            <Text variant="caption" style={styles.tooltipLabel}>
                                                Patients
                                            </Text>
                                        </View>
                                    );
                                },
                            }}
                        />
                    </View>
                </View>
            )}

            {pieChartData.length > 0 && (
                <View style={styles.chartContainer}>
                    <Text weight="bold" color={theme.palette.primary[500]} style={styles.chartTitle}>Distribution</Text>
                    <View style={{ alignItems: 'center' }}>
                        <PieChart
                            data={pieChartData}
                            donut
                            radius={90}
                            innerRadius={50}
                            innerCircleColor={theme.background.card} // Match card color to hide glass overlap
                            showText
                            textColor={theme.text.inverted}
                            textSize={12}
                            centerLabelComponent={() => (
                                <View style={styles.centerLabelContainer}>
                                    <Text style={styles.centerLabelValue}>
                                        {totalPatients}
                                    </Text>
                                    <Text style={styles.centerLabelText}>Total</Text>
                                </View>
                            )}
                        />
                        <View style={styles.legendContainer}>
                            <LegendItem
                                label="Treated"
                                color={theme.status.success}
                                value={statistics.totalTreatedAppointment}
                                styles={styles}
                            />
                            <LegendItem
                                label="Available"
                                color={theme.palette.primary[500]}
                                value={statistics.totalAvailableAtClinic}
                                styles={styles}
                            />
                            <LegendItem
                                label="Pending"
                                color={theme.status.warning}
                                value={statistics.totalUntreatedAppointmentAndNotAvailable}
                                styles={styles}
                            />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

interface LegendItemProps {
    label: string;
    color: string;
    value?: number;
    styles: any;
}

const LegendItem: React.FC<LegendItemProps> = ({ label, color, value, styles }) => (
    <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: color }]} />
        <Text variant="caption" color={color}>{label}: {value || 0}</Text>
    </View>
);
