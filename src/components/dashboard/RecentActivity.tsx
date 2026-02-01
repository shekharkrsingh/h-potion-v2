import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { SectionHeader } from './SectionHeader';
import { createStyles, getDotColor } from '@/styles/components/dashboard/RecentActivity.styles';
import { useRouter } from 'expo-router';
import { formatTimeAgo } from '@/utils/dateUtils';

import { RecentActivitySkeleton } from './DashboardSkeletons';

interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

interface RecentActivityProps {
    notifications: Notification[];
    isLoading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ notifications, isLoading }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();

    if (isLoading) return <RecentActivitySkeleton />;

    const displayNotifications = notifications.slice(0, 3);

    if (notifications.length === 0) {
        return (
            <View style={styles.container}>
                <SectionHeader title="Recent Activity" />
                <View style={styles.card}>
                    <Text align="center" color={theme.text.secondary}>No recent activity</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SectionHeader title="Activity Log" />
            <View style={styles.card}>
                {displayNotifications.map((item, index) => (
                    <View key={item.id} style={styles.activityItem}>
                        <View style={styles.timelineContainer}>
                            <View style={[
                                styles.timelineDot,
                                { backgroundColor: getDotColor(theme, item.isRead) }
                            ]} />
                            {index !== displayNotifications.length - 1 && <View style={styles.timelineLine} />}
                        </View>
                        <View style={styles.contentContainer}>
                            <Text style={styles.title} color={theme.text.primary}>{item.title}</Text>
                            <Text style={styles.message} color={theme.text.secondary} numberOfLines={2}>
                                {item.message}
                            </Text>
                            <Text style={styles.time} color={theme.text.secondary}>
                                {formatTimeAgo(new Date(item.createdAt))}
                            </Text>
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => router.push('/(tabs)/notifications' as any)}
                >
                    <Text style={styles.viewAllText}>View All Activities</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
