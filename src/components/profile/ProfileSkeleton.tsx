import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { Skeleton } from '@/components/ui/Skeleton';
import { getGlassStyle } from '@/styles/common';

export const ProfileSkeleton = () => {
    const { theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background.default }}>
            {/* Header Skeleton */}
            <View style={{ height: 180, backgroundColor: theme.background.subtle, marginBottom: spacing.m }}>
                <Skeleton width="100%" height="100%" borderRadius={0} />
            </View>

            {/* Avatar and Name Section */}
            <View style={{ alignItems: 'center', marginTop: -60, marginBottom: spacing.l }}>
                {/* Avatar with border */}
                <View style={{
                    borderWidth: 6,
                    borderColor: theme.background.default,
                    borderRadius: 60,
                    overflow: 'hidden'
                }}>
                    <Skeleton circle width={120} height={120} />
                </View>

                {/* Name */}
                <Skeleton width={200} height={32} borderRadius={8} style={{ marginTop: spacing.m }} />

                {/* Subtitle/Bio */}
                <Skeleton width={280} height={40} borderRadius={8} style={{ marginTop: spacing.s }} />

                {/* Badge/Status */}
                <Skeleton width={100} height={24} borderRadius={12} style={{ marginTop: spacing.m }} />
            </View>

            {/* Content Sections Skeleton */}
            {[1, 2, 3].map((_, index) => (
                <View key={index} style={{ marginHorizontal: spacing.l, marginBottom: spacing.l }}>
                    {/* Section Title */}
                    <Skeleton width={150} height={20} borderRadius={4} style={{ marginBottom: spacing.s }} />

                    {/* Section Card with Glass Style */}
                    <View style={[
                        {
                            borderRadius: 24,
                            padding: 20,
                            overflow: 'hidden',
                        },
                        getGlassStyle(theme)
                    ]}>
                        <Skeleton width="100%" height={20} borderRadius={4} style={{ marginBottom: 16 }} />
                        <Skeleton width="80%" height={20} borderRadius={4} style={{ marginBottom: 16 }} />
                        <Skeleton width="90%" height={20} borderRadius={4} />
                    </View>
                </View>
            ))}
        </View>
    );
};
