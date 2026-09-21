import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';
import { getGlassStyle } from '@/styles/common';

export const createEditComponentStyles = (theme: ColorTheme) => StyleSheet.create({
    // Section Card
    sectionCard: {
        marginHorizontal: spacing.l,
        marginVertical: spacing.s,
        borderRadius: radius.xl,
        overflow: 'hidden',
        ...getGlassStyle(theme),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.l,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: radius.l,
        backgroundColor: theme.mode === 'light' ? theme.palette.primary[50] : 'rgba(14, 165, 233, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
        borderWidth: 1,
        borderColor: theme.mode === 'light' ? theme.palette.primary[100] : 'rgba(14, 165, 233, 0.2)',
        // Glow effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textWrapper: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: typography.fontFamily.bold,
        color: theme.text.primary,
        marginBottom: 2,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: theme.text.secondary,
        fontFamily: typography.fontFamily.medium,
    },
    statusIndicator: {
        width: 24,
        height: 24,
        borderRadius: radius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusComplete: {
        backgroundColor: theme.status.successBg,
    },
    statusEmpty: {
        backgroundColor: theme.background.subtle,
        borderWidth: 1,
        borderColor: theme.border.subtle,
    },

    // Image Header
    headerContainer: {
        marginBottom: spacing.xxl,
    },
    coverWrapper: {
        height: 220,
        width: '100%',
        backgroundColor: theme.background.subtle,
        borderBottomLeftRadius: radius.xxl,
        borderBottomRightRadius: radius.xxl,
        overflow: 'hidden',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    coverOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    editCoverButton: {
        position: 'absolute',
        top: spacing.l,
        right: spacing.l,
        backgroundColor: theme.background.modal,
        padding: spacing.s,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        ...shadows.s,
    },
    avatarWrapper: {
        alignSelf: 'center',
        marginTop: -60,
        zIndex: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: theme.background.modal,
        backgroundColor: theme.background.subtle,
    },
    editProfileButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.palette.primary[500],
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: theme.background.default,
        ...shadows.s,
    },

    // Form Elements
    inputContainer: {
        marginBottom: spacing.l,
    },
    label: {
        fontSize: 14,
        fontFamily: typography.fontFamily.bold,
        color: theme.text.secondary,
        marginBottom: spacing.xs,
        marginLeft: spacing.xs,
    },
    premiumInput: {
        backgroundColor: theme.background.subtle,
        borderRadius: radius.m,
        padding: spacing.m,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        color: theme.text.primary,
        fontSize: 16,
        // Soft glow for inputs
        shadowColor: theme.palette.primary[500],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    focusedInput: {
        borderColor: theme.palette.primary[500],
        backgroundColor: theme.background.default,
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    errorText: {
        fontSize: 12,
        fontFamily: typography.fontFamily.medium,
        marginTop: spacing.xs,
        marginLeft: spacing.xs,
    },

    // Skeletons
    skeletonContainer: {
        padding: spacing.l,
        gap: spacing.m,
    },
    skeletonHeader: {
        height: 100,
        backgroundColor: theme.background.subtle,
        borderRadius: radius.l,
    },
    skeletonItem: {
        height: 64,
        backgroundColor: theme.background.subtle,
        borderRadius: radius.m,
    }
});
