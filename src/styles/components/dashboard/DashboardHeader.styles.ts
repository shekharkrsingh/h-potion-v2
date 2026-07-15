import { StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';

// Helper for header background - exported separately to keep StyleSheet clean
export const getHeaderBackground = (transparent: boolean, isDark: boolean) => {
    if (transparent) return 'transparent';
    return isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)';
};

export const createStyles = (theme: ColorTheme) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.l,
            paddingVertical: spacing.l,
        },
        profileSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.m,
        },
        avatarContainer: {
            width: 48,
            height: 48,
            borderRadius: radius.full,
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
        },
        avatar: {
            width: '100%',
            height: '100%',
        } as ImageStyle,
        greetingContainer: {
            justifyContent: 'center',
        },
        greeting: {
            fontSize: 14,
            opacity: 0.8,
        },
        greetingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        name: {
            fontSize: 18,
        },
        actions: {
            flexDirection: 'row',
            gap: spacing.s,
        },
        iconButton: {
            width: 44,
            height: 44,
            borderRadius: radius.full,
            justifyContent: 'center',
            alignItems: 'center',
            ...getGlassStyle(theme),
            padding: 0,
        },

        workloadText: {
            marginTop: 2,
            fontWeight: '600',
        },
        defaultAvatar: {
            flex: 1,
            backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            justifyContent: 'center',
            alignItems: 'center',
        }
    });

    return styles;
};
