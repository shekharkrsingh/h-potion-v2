import { StyleSheet, Platform } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';
import { getGlassStyle } from '@/styles/common';

export const createSettingsStyles = (theme: ColorTheme, insets: any, isDark: boolean) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.canvas,
        },
        background: {
            flex: 1,
            width: '100%',
            height: '100%',
        },
        header: {
            height: 64 + (Platform.OS === 'ios' ? 0 : insets.top),
            justifyContent: 'center',
            zIndex: 10,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderBottomWidth: 1,
            borderColor: theme.border.subtle,
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.l,
            justifyContent: 'space-between',
            marginTop: Platform.OS === 'ios' ? 0 : insets.top / 2,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: radius.full,
            backgroundColor: theme.background.subtle,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 18,
            fontFamily: typography.fontFamily.bold,
            color: theme.text.primary,
            textAlign: 'center',
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            paddingBottom: spacing.xxl + insets.bottom,
        },
        profileSummary: {
            marginHorizontal: spacing.l,
            marginTop: spacing.m,
            marginBottom: spacing.l,
            padding: spacing.xl,
            borderRadius: radius.xxl,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background.default,
            borderWidth: 1,
            borderColor: theme.border.subtle,
            ...shadows.xl,
            shadowColor: '#000',
        },
        placeholderIcon: {
            width: 40,
        },
        signOutButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing.xl,
            padding: spacing.l,
            borderRadius: radius.xl,
            ...getGlassStyle(theme),
        },
        deleteDataButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: spacing.l,
            marginBottom: spacing.xxl,
            padding: spacing.l,
        },
        buttonText: {
            marginLeft: spacing.m,
        },
        profileAvatarWrapper: {
            width: 70,
            height: 70,
            borderRadius: 35,
            borderWidth: 3,
            borderColor: `${theme.palette.primary[500]}20`,
            padding: 2,
        },
        profileAvatar: {
            flex: 1,
            borderRadius: 33,
            backgroundColor: theme.background.subtle,
        },
        profileInfo: {
            marginLeft: spacing.l,
            flex: 1,
        },
        sectionLabel: {
            fontSize: 12,
            fontFamily: typography.fontFamily.bold,
            color: theme.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            marginLeft: spacing.xl,
            marginTop: spacing.xl,
            marginBottom: spacing.s,
        },
        footer: {
            padding: spacing.xl,
            alignItems: 'center',
            gap: spacing.s,
        },
        versionText: {
            fontSize: 12,
            color: theme.text.tertiary,
            fontFamily: typography.fontFamily.regular,
        },
        legalLinks: {
            flexDirection: 'row',
            gap: spacing.m,
        },
        legalLink: {
            fontSize: 12,
            color: theme.palette.primary[500],
            fontFamily: typography.fontFamily.bold,
        },
        divider: {
            height: 1,
            width: '100%',
            backgroundColor: theme.border.subtle,
            marginVertical: 4
        },
        // Modal Specific (Matches Edit Profile)
        modalContent: {
            backgroundColor: isDark ? 'rgba(23, 23, 23, 0.98)' : theme.background.default,
            borderTopLeftRadius: radius.xxl,
            borderTopRightRadius: radius.xxl,
            paddingTop: spacing.l,
            paddingHorizontal: spacing.l,
            paddingBottom: spacing.xxl + insets.bottom,
            borderWidth: 1,
            borderColor: theme.border.subtle,
        },
        currentEmailCard: {
            padding: spacing.l,
            borderRadius: radius.l,
            marginBottom: spacing.l,
            ...getGlassStyle(theme),
        }
    });
};
