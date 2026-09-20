import { StyleSheet, ViewStyle, Platform } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';
import { getGlassStyle } from '@/styles/common';

export const createStyles = (theme: ColorTheme) => {
    const isDark = theme.mode === 'dark';
    const glassStyle = getGlassStyle(theme);

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.default,
        },
        background: {
            flex: 1,
            width: '100%',
        },
        header: {
            paddingHorizontal: spacing.xl,
            paddingTop: spacing.xl,
            paddingBottom: spacing.m,
        },
        headerTopRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.m,
        },
        headerActions: {
            flexDirection: 'row',
            gap: 12,
        },
        iconButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.s,
            borderWidth: 1,
            borderColor: theme.border.subtle,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '800',
            color: theme.text.primary,
            letterSpacing: -0.5,
        },
        // Search
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.5)',
            borderRadius: radius.l,
            paddingHorizontal: spacing.m,
            height: 48,
            borderWidth: 1,
            borderColor: theme.border.subtle,
        },
        searchIcon: {
            marginRight: spacing.s,
        },
        searchInput: {
            flex: 1,
            height: '100%',
            color: theme.text.primary,
            fontSize: 15,
            fontWeight: '500',
        },

        // Filters
        filterSection: {
            paddingHorizontal: spacing.xl,
            marginBottom: spacing.m,
        },
        filterScrollView: {
            flexDirection: 'row',
            gap: spacing.s,
        },
        filterChip: {
            paddingHorizontal: spacing.l,
            paddingVertical: spacing.s,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: theme.border.default,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        },
        activeFilterChip: {
            backgroundColor: theme.palette.primary[500],
            borderColor: theme.palette.primary[500],
            ...shadows.s,
        },
        filterText: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.text.secondary,
        },
        activeFilterText: {
            color: '#FFFFFF',
        },

        // List
        scrollContent: {
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing.xxl,
        },
        bookingCard: {
            marginBottom: spacing.m,
            borderRadius: radius.l,
            overflow: 'hidden',
            ...getGlassStyle(theme),
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1,
            borderColor: theme.border.subtle,
            shadowColor: theme.palette.primary[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 10,
        },
        bookingCardEmergency: {
            borderColor: 'rgba(239, 68, 68, 0.3)',
            borderLeftWidth: 4,
            borderLeftColor: '#EF4444',
        },
        bookingCardCancelled: {
            borderColor: isDark ? 'rgba(148, 163, 184, 0.3)' : '#E2E8F0',
            borderLeftWidth: 4,
            borderLeftColor: '#64748B',
        },
        bookingCardOnline: {
            borderColor: 'rgba(56, 189, 248, 0.25)',
            borderLeftWidth: 4,
            borderLeftColor: '#38BDF8',
        },
        cardContent: {
            padding: spacing.l,
        },
        badge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: radius.full,
            marginLeft: spacing.s,
        },
        badgeText: {
            fontSize: 10,
            fontFamily: typography.fontFamily.bold,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        patientInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.m,
            flex: 1,
        },
        avatarContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isDark ? theme.palette.primary[900] : theme.palette.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: isDark ? theme.palette.primary[800] : theme.palette.primary[100],
        },
        patientName: {
            fontSize: 16,
            fontWeight: '700',
            color: theme.text.primary,
        },
        appointmentTime: {
            fontSize: 12,
            color: theme.text.secondary,
            marginTop: 2,
        },

        // Empty State
        emptyState: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 60,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.text.primary,
            marginTop: spacing.m,
        },
        emptySubtitle: {
            fontSize: 14,
            color: theme.text.secondary,
            textAlign: 'center',
            marginTop: 8,
            paddingHorizontal: spacing.xxl,
            lineHeight: 20,
        },
        // Modal
        modalBackdrop: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'flex-end',
        },
        summaryContainer: {
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            minHeight: '45%',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -10 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 20,
            elevation: 20,
        },
        modalContent: {
            padding: spacing.xl,
            paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.l,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: theme.text.primary,
        },
        filterOption: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: spacing.s,
            paddingHorizontal: spacing.m,
            borderRadius: radius.l,
            marginBottom: spacing.xs,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            borderWidth: 1,
            borderColor: 'transparent',
        },
        activeFilterOption: {
            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.1)' : theme.palette.primary[50], // Using primary color approximation for dark mode bg
            borderColor: theme.palette.primary[500],
        },
        filterOptionText: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.text.secondary,
        },
        activeFilterOptionText: {
            color: theme.palette.primary[500],
        },
        modalHeaderText: {
            fontSize: 13,
            fontWeight: '700',
            color: theme.text.tertiary,
            marginBottom: spacing.m,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
        },
        summaryIconContainer: {
            width: 32,
            height: 32,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.s,
        },
    });
};
