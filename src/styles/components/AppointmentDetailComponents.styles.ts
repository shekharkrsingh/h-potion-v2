import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';
import { getGlassStyle } from '@/styles/common';

export const createAppointmentDetailComponentStyles = (theme: ColorTheme) => StyleSheet.create({
    // CARD CONTAINER (Shared)
    sectionCard: {
        ...getGlassStyle(theme),
        borderRadius: radius.xl,
        padding: spacing.l,
        marginBottom: spacing.xl,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.l,
        gap: spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.subtle,
        paddingBottom: spacing.s,
    },
    sectionTitle: {
        ...typography.presets.h4,
        fontSize: 17,
        fontWeight: '700',
        color: theme.text.primary,
        marginBottom: 0,
    },

    // INFO ROWS
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.subtle,
    },
    lastInfoRow: {
        borderBottomWidth: 0,
    },
    infoIconContainer: {
        width: 48,
        height: 48,
        borderRadius: radius.l,
        backgroundColor: theme.mode === 'dark' ? 'rgba(14, 165, 233, 0.1)' : theme.palette.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.m,
        borderWidth: 1,
        borderColor: theme.mode === 'dark' ? 'rgba(14, 165, 233, 0.2)' : theme.palette.primary[100],
        shadowColor: theme.palette.primary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.mode === 'dark' ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.text.tertiary,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        ...typography.presets.bodyMedium,
        color: theme.text.primary,
        fontWeight: '600',
        fontSize: 15,
    },

    // TIMELINE
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 24, // Spaced out for readability
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: spacing.m,
        width: 24, // Fixed width for alignment
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        zIndex: 2,
        borderWidth: 2,
        borderColor: theme.background.card, // cutout effect
    },
    timelineLine: {
        width: 2,
        flex: 1,
        marginTop: 4,
        borderRadius: 1,
    },
    timelineContent: {
        flex: 1,
        justifyContent: 'center', // Sustain alignment with dot
        paddingBottom: 4, // Visual balance
    },
    timelineTitle: {
        ...typography.presets.bodyMedium,
        fontWeight: '600',
        color: theme.text.primary,
        marginBottom: 2,
    },
    timelineTime: {
        ...typography.presets.caption,
        color: theme.text.tertiary,
    },

    // BADGE
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.full,
        borderWidth: 1,
        gap: 6,
    },
    statusText: {
        ...typography.presets.caption,
        fontWeight: '700',
        fontSize: 11,
    }
});
