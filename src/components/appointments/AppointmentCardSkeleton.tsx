import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { FadeInView } from '@/components/ui/FadeInView';

export const AppointmentCardSkeleton = ({ delay = 100 }: { delay?: number }) => {
    const { theme } = useTheme();

    return (
        <FadeInView delay={delay} duration={400} style={[styles.container, { backgroundColor: theme.background.card }]}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Skeleton width={44} height={44} borderRadius={22} />
                    <View style={styles.info}>
                        <Skeleton width={120} height={18} borderRadius={4} style={{ marginBottom: 6 }} />
                        <Skeleton width={80} height={14} borderRadius={4} />
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <Skeleton width={70} height={24} borderRadius={12} />
                    <Skeleton width={22} height={22} borderRadius={11} />
                </View>
            </View>
        </FadeInView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.m,
        borderRadius: radius.xl,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m,
    },
    info: {
        justifyContent: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.m,
    }
});
