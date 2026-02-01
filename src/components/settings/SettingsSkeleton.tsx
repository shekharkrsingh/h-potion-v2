import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { ColorTheme } from '@/theme/colors';

interface SettingsSkeletonProps {
    theme: ColorTheme;
}

export const SettingsSkeleton = ({ theme }: SettingsSkeletonProps) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.7, 0.3],
    });

    const SkeletonItem = ({ style }: { style: any }) => (
        <Animated.View style={[style, { opacity, backgroundColor: theme.background.subtle }]} />
    );

    return (
        <View style={styles.container}>
            {/* Profile Header Skeleton */}
            <View style={[styles.profileCard, { backgroundColor: theme.background.card }]}>
                <SkeletonItem style={styles.avatar} />
                <View style={styles.profileText}>
                    <SkeletonItem style={styles.titleLine} />
                    <SkeletonItem style={styles.subTitleLine} />
                </View>
            </View>

            {/* Sections Skeleton */}
            {[1, 2, 3].map((i) => (
                <View key={i} style={styles.section}>
                    <SkeletonItem style={styles.label} />
                    <View style={[styles.card, { backgroundColor: theme.background.card }]}>
                        <SkeletonItem style={styles.cardItem} />
                        <SkeletonItem style={styles.cardItem} />
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.l,
    },
    profileCard: {
        flexDirection: 'row',
        padding: spacing.xl,
        borderRadius: radius.xxl,
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    profileText: {
        marginLeft: spacing.l,
        flex: 1,
    },
    titleLine: {
        height: 20,
        width: '60%',
        borderRadius: 4,
        marginBottom: 8,
    },
    subTitleLine: {
        height: 14,
        width: '80%',
        borderRadius: 4,
    },
    section: {
        marginBottom: spacing.xl,
    },
    label: {
        height: 12,
        width: 100,
        borderRadius: 4,
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        borderRadius: radius.xl,
        padding: spacing.m,
    },
    cardItem: {
        height: 50,
        width: '100%',
        borderRadius: radius.m,
        marginVertical: 4,
    },
});
