import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export const TeamSkeleton = () => {
    return (
        <View style={styles.container}>
            {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.card}>
                    <Skeleton circle width={52} height={52} style={styles.avatar} />
                    <View style={styles.content}>
                        <Skeleton width="60%" height={18} style={styles.line} />
                        <View style={styles.row}>
                            <Skeleton width="30%" height={12} style={styles.line} />
                            <Skeleton width="20%" height={12} style={styles.line} />
                        </View>
                        <Skeleton width="80%" height={12} style={styles.line} />
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.l,
    },
    card: {
        flexDirection: 'row',
        padding: spacing.l,
        borderRadius: radius.xl,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginBottom: spacing.m,
        alignItems: 'center',
    },
    avatar: {
        marginRight: spacing.m,
    },
    content: {
        flex: 1,
    },
    line: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.m,
    }
});
