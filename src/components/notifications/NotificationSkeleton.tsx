import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTheme } from '@/theme/ThemeContext';
import { createSkeletonStyles } from '@/styles/components/NotificationSkeleton.styles';

export const NotificationSkeleton = () => {
    const { theme } = useTheme();
    const styles = createSkeletonStyles(theme);

    return (
        <View style={styles.listContent}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((key) => (
                <View key={key} style={styles.notificationItem}>
                    <View style={styles.row}>
                        {/* Icon Skeleton - Matches squircle shape */}
                        <Skeleton width={40} height={40} borderRadius={12} style={styles.iconSkeleton} />
                        <View style={styles.textContainer}>
                            {/* Title & Time Skeleton - Title only */}
                            <View style={styles.headerRow}>
                                <Skeleton width="50%" height={16} />
                                <Skeleton width={40} height={12} />
                            </View>
                            {/* Removed body skeleton to match collapsed state */}
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};
