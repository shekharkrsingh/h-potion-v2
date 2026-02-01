import { StyleSheet, Platform, Dimensions } from 'react-native';
import { typography } from '@/theme/typography';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { getGlassStyle } from '@/styles/common';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.default,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    // Standard Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.l,
        paddingTop: Platform.OS === 'android' ? spacing.xl + 12 : spacing.xxl,
        paddingBottom: spacing.m,
        zIndex: 10,
        backgroundColor: 'transparent', // Or theme.background.default if not using img bg
    },
    iconButton: {
        padding: spacing.s,
        borderRadius: radius.full,
        backgroundColor: theme.background.card,
        ...shadows.s,
    },
    headerTitle: {
        ...typography.presets.h4,
        color: theme.text.primary,
        fontWeight: 'bold',
    },

    // Scroll Content
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: spacing.l,
        paddingBottom: 100,
        paddingTop: spacing.s,
    },

    // HERO SECTION (Standardized)
    heroSection: {
        alignItems: 'center',
        marginBottom: spacing.l,
        marginTop: spacing.s,
    },
    heroAvatarContainer: {
        marginBottom: spacing.m,
        shadowColor: theme.palette.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    patientName: {
        ...typography.presets.h3, // Standard H3
        color: theme.text.primary,
        marginBottom: 4,
        textAlign: 'center',
    },
    patientId: {
        ...typography.presets.caption,
        color: theme.text.secondary,
        marginBottom: spacing.m,
        textAlign: 'center',
    },
    statusRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.s,
    },

    // STANDARD CARD PATTERN
    sectionCard: {
        ...getGlassStyle(theme),
        borderRadius: radius.xl,
        padding: spacing.l,
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.presets.h4,
        fontSize: 17, // Slightly larger
        fontWeight: '700',
        color: theme.text.primary,
        marginBottom: 0, // Header row handles gap
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

    // INFO ROWS
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.m, // More breathing room
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
        backgroundColor: theme.mode === 'dark' ? 'rgba(14, 165, 233, 0.1)' : theme.palette.primary[50], // Glassy dark
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
        textTransform: 'uppercase', // Premium feel
        letterSpacing: 0.5,
    },
    infoValue: {
        ...typography.presets.bodyMedium,
        color: theme.text.primary,
        fontWeight: '600',
        fontSize: 15,
    },

    // ACTIONS GRID
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.m, // Better gap
    },

    // SMART FAB
    fabContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 40 : 30,
        alignSelf: 'center',
        zIndex: 100,
    },
    smartFab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: radius.full,
        ...shadows.l, // Elevate it
        gap: 10,
        elevation: 10,
    },
    smartFabText: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // TIMELINE (Option 2: Modern Journey)
    timelineItem: {
        flexDirection: 'row',
        minHeight: 60, // Ensure height for connecting lines
    },
    timelineLeft: {
        width: 40,
        alignItems: 'center',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: theme.border.subtle,
        marginVertical: 4,
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginTop: 6,
        borderWidth: 2,
        borderColor: theme.background.card, // "Hollow" effect if needed or ring
        zIndex: 1,
    },
    timelineContent: {
        flex: 1,
        paddingBottom: spacing.l,
        paddingLeft: spacing.s,
        paddingTop: 2, // Align text with dot
    },
    timelineTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.text.primary,
        marginBottom: 2,
    },
    timelineTime: {
        fontSize: 13,
        color: theme.text.tertiary,
    },

    // BADGES (Option 3: Refined Pills)
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8, // Modern sleek radius (not full pill)
        gap: 6,
        borderWidth: 1, // Subtle crisp border
        borderColor: 'transparent',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.2,
    },

    // Notes
    notesContainer: {
        backgroundColor: theme.background.subtle,
        padding: spacing.m,
        borderRadius: radius.m,
        marginTop: spacing.s,
        borderLeftWidth: 3,
        borderLeftColor: theme.palette.primary[500],
        color: theme.text.secondary,
        fontStyle: 'italic',
    },

    // ERROR & FEEDBACK STATES
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.l,
        backgroundColor: theme.background.default,
    },
    errorIcon: {
        marginBottom: spacing.m,
    },
    errorTitle: {
        ...typography.presets.h3,
        textAlign: 'center',
        marginBottom: spacing.s,
        color: theme.text.primary,
    },
    errorText: {
        ...typography.presets.bodyMedium,
        textAlign: 'center',
        color: theme.text.secondary,
        marginBottom: spacing.l,
    },
    retryButton: {
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        backgroundColor: theme.palette.primary[500],
        borderRadius: radius.m,
        ...shadows.s,
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: '700',
    }
});
