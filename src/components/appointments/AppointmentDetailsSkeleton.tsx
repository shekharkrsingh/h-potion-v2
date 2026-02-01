import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { getGlassStyle } from '@/styles/common';
import { FadeInView } from '@/components/ui/FadeInView';

export const AppointmentDetailsSkeleton = () => {
    const { theme, isDark } = useTheme();
    const headerHeight = Platform.OS === 'android' ? 90 : 110;

    return (
        <View style={[styles.container, { paddingTop: headerHeight + spacing.l }]}>
            {/* Hero Section (Not a card, just centered content) */}
            <FadeInView duration={600} style={styles.heroSection}>
                <View style={styles.avatarContainer}>
                    <Skeleton width={100} height={100} borderRadius={50} />
                </View>
                <Skeleton width={180} height={32} borderRadius={8} style={{ marginBottom: 8 }} />
                <Skeleton width={100} height={20} borderRadius={100} style={{ marginBottom: 24 }} />

                <View style={styles.rowCentered}>
                    <Skeleton width={80} height={28} borderRadius={100} />
                    <Skeleton width={80} height={28} borderRadius={100} />
                </View>
            </FadeInView>

            {/* Content Cards */}
            <FadeInView duration={600} delay={100} style={[styles.card, { backgroundColor: theme.background.card }]}>
                <View style={styles.cardHeader}>
                    <Skeleton width={24} height={24} borderRadius={12} />
                    <Skeleton width={140} height={20} borderRadius={4} />
                </View>

                <View style={styles.row}>
                    <Skeleton width={44} height={44} borderRadius={12} />
                    <View style={{ gap: 8 }}>
                        <Skeleton width={60} height={12} borderRadius={4} />
                        <Skeleton width={160} height={16} borderRadius={4} />
                    </View>
                </View>
                <View style={[styles.row, { marginTop: 24 }]}>
                    <Skeleton width={44} height={44} borderRadius={12} />
                    <View style={{ gap: 8 }}>
                        <Skeleton width={60} height={12} borderRadius={4} />
                        <Skeleton width={120} height={16} borderRadius={4} />
                    </View>
                </View>
            </FadeInView>

            <FadeInView duration={600} delay={200} style={[styles.card, { backgroundColor: theme.background.card }]}>
                <View style={styles.cardHeader}>
                    <Skeleton width={24} height={24} borderRadius={12} />
                    <Skeleton width={100} height={20} borderRadius={4} />
                </View>
                <View style={styles.grid}>
                    <Skeleton width="48%" height={80} borderRadius={16} />
                    <Skeleton width="48%" height={80} borderRadius={16} />
                </View>
            </FadeInView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.l,
        flex: 1,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        marginBottom: spacing.m,
        // Match the border style of actual avatar if possible, but skeleton is simple
    },
    card: {
        padding: spacing.l,
        borderRadius: radius.xl,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)', // Subtle
    },
    cardHeader: {
        flexDirection: 'row',
        gap: spacing.m,
        marginBottom: spacing.l,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: spacing.m,
        alignItems: 'center',
    },
    rowCentered: {
        flexDirection: 'row',
        gap: spacing.m,
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    }
});
