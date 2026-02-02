import { StyleSheet, Platform } from 'react-native';
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
        bookingCard: {
            marginBottom: spacing.m,
            borderRadius: radius.l,
            overflow: 'hidden',
            ...glassStyle,
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.7)',
            borderWidth: 1,
            borderColor: theme.border.subtle,
            shadowColor: theme.palette.primary[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.05,
            shadowRadius: 10,
        },
        bookingCardEmergency: {
            borderColor: theme.status.errorBg,
            borderLeftWidth: 4,
            borderLeftColor: theme.status.error,
        },
        bookingCardCancelled: {
            borderColor: isDark ? 'rgba(148, 163, 184, 0.3)' : '#E2E8F0',
            borderLeftWidth: 4,
            borderLeftColor: theme.palette.neutral[500],
        },
        bookingCardOnline: {
            borderColor: 'rgba(56, 189, 248, 0.25)',
            borderLeftWidth: 4,
            borderLeftColor: theme.palette.primary[300],
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
    });
};
