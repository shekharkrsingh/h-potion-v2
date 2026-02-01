import React from 'react';
import { View } from 'react-native';
import { StatsCard } from './StatsCard';
import { CalendarCheck, Clock, CheckCircle, Activity } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { createStyles } from '@/styles/components/dashboard/StatsOverview.styles';
import { StatsCardSkeleton } from './DashboardSkeletons';
import { FadeInView } from '@/components/ui/FadeInView';

interface StatsData {
    totalAppointments?: number;
    treatedPatients?: number;
    availableHours?: number;
    completionRate?: number;
    appointmentsTrend?: { value: number; isPositive: boolean };
    treatedTrend?: { value: number; isPositive: boolean };
}

interface StatsOverviewProps {
    data: StatsData;
    isLoading?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ data, isLoading }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.grid}>
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} style={styles.cardWrapper}>
                            <StatsCardSkeleton />
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    if (!data) return null;

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                <View style={styles.cardWrapper}>
                    <StatsCard
                        label="Total Appointments"
                        value={data.totalAppointments || 0}
                        icon={<CalendarCheck size={20} color={theme.palette.primary[600]} />}
                        colorKey="primary"
                        trend={data.appointmentsTrend}
                    />
                </View>
                <View style={styles.cardWrapper}>
                    <StatsCard
                        label="Treated Patients"
                        value={data.treatedPatients || 0}
                        icon={<CheckCircle size={20} color={theme.palette.secondary[600]} />}
                        colorKey="secondary"
                        trend={data.treatedTrend}
                    />
                </View>
                <View style={styles.cardWrapper}>
                    <StatsCard
                        label="Hours Available"
                        value={data.availableHours || 0}
                        icon={<Clock size={20} color={theme.palette.info[600]} />}
                        colorKey="info"
                    />
                </View>
                <View style={styles.cardWrapper}>
                    <StatsCard
                        label="Completion Rate"
                        value={`${data.completionRate || 0}%`}
                        icon={<Activity size={20} color={theme.palette.warning[600]} />}
                        colorKey="warning"
                    />
                </View>
            </View>
        </View>
    );
};
