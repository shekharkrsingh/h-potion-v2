import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';
import { spacing } from '@/theme/spacing';

const { width } = Dimensions.get('window');

const SkeletonItem = ({ width, height, borderRadius, style }: any) => {
    const { theme } = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: theme.text.tertiary, // Use tertiary color for skeleton
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const ProfileSkeleton = () => {
    const { theme } = useTheme();
    const componentStyles = createProfileComponentStyles(theme);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background.default }}>
            {/* Header Skeleton */}
            <View style={{ height: 180, backgroundColor: theme.background.subtle, marginBottom: spacing.m }}>
                <SkeletonItem width="100%" height="100%" borderRadius={0} />
            </View>

            <View style={{ alignItems: 'center', marginTop: -60, marginBottom: spacing.l }}>
                <SkeletonItem width={120} height={120} borderRadius={60} style={{ borderWidth: 6, borderColor: theme.background.default }} />
                <SkeletonItem width={200} height={32} borderRadius={8} style={{ marginTop: spacing.m }} />
                <SkeletonItem width={280} height={40} borderRadius={8} style={{ marginTop: spacing.s }} />
                <SkeletonItem width={100} height={24} borderRadius={12} style={{ marginTop: spacing.m }} />
            </View>

            {/* Sections Skeleton */}
            {[1, 2, 3].map((_, index) => (
                <View key={index} style={{ marginHorizontal: spacing.l, marginBottom: spacing.l }}>
                    <SkeletonItem width={150} height={20} borderRadius={4} style={{ marginBottom: spacing.s }} />
                    <View style={{
                        height: 120,
                        borderRadius: 24,
                        backgroundColor: theme.background.subtle, // Mimic glass background
                        padding: 20,
                        borderWidth: 1,
                        borderColor: theme.border.subtle
                    }}>
                        <SkeletonItem width="100%" height={20} borderRadius={4} style={{ marginBottom: 16 }} />
                        <SkeletonItem width="80%" height={20} borderRadius={4} style={{ marginBottom: 16 }} />
                        <SkeletonItem width="90%" height={20} borderRadius={4} />
                    </View>
                </View>
            ))}
        </View>
    );
};
