import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { spacing } from '@/theme/spacing';
import { getGlassStyle } from '@/styles/common';
import { useTheme } from '@/theme/ThemeContext';

export const BookingCardSkeleton = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.card, getGlassStyle(theme)]}>
            <View style={styles.content}>
                {/* Avatar */}
                <Skeleton circle width={48} height={48} style={{ marginRight: spacing.m }} />

                {/* Info */}
                <View style={{ flex: 1, gap: 8 }}>
                    {/* Name */}
                    <Skeleton width="60%" height={20} borderRadius={6} />
                    {/* Time & Type Details */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Skeleton width={60} height={14} borderRadius={4} />
                        <Skeleton width={16} height={16} borderRadius={8} />
                    </View>
                </View>

                {/* Chevron Placeholder */}
                <Skeleton width={20} height={20} borderRadius={10} style={{ marginLeft: spacing.s }} />
            </View>
        </View>
    );
};

export const BookingListSkeleton = () => {
    return (
        <View style={styles.container}>
            {Array.from({ length: 6 }).map((_, index) => (
                <BookingCardSkeleton key={index} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.xl,
        gap: spacing.m,
    },
    card: {
        borderRadius: 24,
        padding: spacing.l,
        marginBottom: spacing.m,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
