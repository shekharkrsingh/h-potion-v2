import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

import { getGlassStyle } from '@/styles/common';

export const createProfileComponentStyles = (theme: ColorTheme) => StyleSheet.create({
    // ProfileHeader Styles
    headerContainer: {
        alignItems: 'center',
        paddingBottom: spacing.l,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        marginBottom: spacing.l,
        overflow: 'hidden',
        backgroundColor: theme.background.default,
    },
    coverImage: {
        width: '100%',
        height: 180,
        position: 'absolute',
        top: 0,
    },
    headerContent: {
        marginTop: 100, // Push content down to overlap cover
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: spacing.l,
    },
    editButtonContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    editButton: {
        backgroundColor: theme.background.default,
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        elevation: 4,
        shadowColor: theme.palette.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    bioText: {
        marginTop: 4,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: spacing.m,
        shadowColor: theme.palette.neutral[900],
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 16,
        borderWidth: 6,
        borderColor: theme.palette.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background.subtle,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 55,
    },
    initialsText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.palette.primary[600],
        includeFontPadding: false,
        textAlign: 'center',
    },
    roleBadge: {
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        marginTop: spacing.s,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },

    // ProfileSection Styles
    sectionContainer: {
        marginBottom: spacing.l,
        marginHorizontal: spacing.l,
    },
    sectionTitle: {
        marginBottom: spacing.s,
        marginLeft: spacing.xs,
        fontSize: 13,
        letterSpacing: 0.5,
        fontWeight: 'bold',
    },
    sectionContent: {
        ...getGlassStyle(theme),
        borderRadius: 24,
        padding: 20,
    },

    // ProfileOption Styles
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.s,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    optionLabel: {
        flex: 1,
    },
    optionDivider: {
        height: 1,
        backgroundColor: theme.border.subtle,
        marginLeft: 60,
        opacity: 0.5,
    },

    // Chips for Arrays (Education/Languages)
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        backgroundColor: theme.background.subtle,
        paddingHorizontal: spacing.m,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.border.subtle,
    },

    // ThemeSelector Styles
    themeSelectorContainer: {
        flexDirection: 'row',
        backgroundColor: theme.background.subtle,
        borderRadius: 16,
        padding: 6,
        marginTop: spacing.s,
        borderWidth: 1,
        borderColor: theme.border.subtle,
    },
    themeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    themeOptionActive: {
        backgroundColor: theme.background.card,
        shadowColor: theme.palette.neutral[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1, // Optional: add a subtle border to active item
        borderColor: theme.border.subtle, // or a primary color if preferred
    },
    // DetailRow Styles
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 6,
    },
    detailIconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: 8,
        marginTop: 2,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        marginBottom: 2,
    },
    detailValue: {
        flexWrap: 'wrap',
        lineHeight: 20,
    },
});
