import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.default,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // --- Header --- //
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.l,
        height: 60,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    } as ViewStyle,
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.text.primary,
        letterSpacing: 0.5,
    } as TextStyle,

    // --- Stats Row --- //
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.l,
        marginBottom: spacing.l,
        gap: spacing.m,
    },
    statGradient: {
        flex: 1,
        borderRadius: radius.l,
        padding: 1,
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.background.card,
        borderRadius: radius.l - 1,
        padding: spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: theme.text.secondary,
        fontWeight: '700',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 1,
    } as TextStyle,
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.palette.primary[500], // Highlighted color
    } as TextStyle,

    // --- Tabs --- //
    tabsContainer: {
        marginHorizontal: spacing.l,
        flexDirection: 'row',
        backgroundColor: theme.background.subtle,
        borderRadius: radius.m,
        padding: 4,
        marginBottom: spacing.l,
        borderWidth: 1,
        borderColor: theme.border.subtle,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: radius.m - 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: theme.background.card,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    } as ViewStyle,
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.text.tertiary,
    } as TextStyle,
    activeTabText: {
        color: theme.palette.primary[500],
        fontWeight: '700',
    } as TextStyle,

    // --- List --- //
    listContent: {
        paddingHorizontal: spacing.l,
        paddingBottom: 120, // Extra space for FAB
    },

    // --- Card (Unified Standard) --- //
    card: {
        flexDirection: 'row',
        padding: spacing.l,
        backgroundColor: theme.background.card,
        borderRadius: radius.xl,
        marginBottom: spacing.m,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        alignItems: 'center',
    } as ViewStyle,
    avatarContainer: {
        marginRight: spacing.m,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: theme.mode === 'dark' ? 'rgba(14, 165, 233, 0.15)' : theme.palette.primary[50],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.mode === 'dark' ? 'rgba(14, 165, 233, 0.25)' : theme.palette.primary[100],
    } as ViewStyle,
    avatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.mode === 'dark' ? theme.palette.primary[400] : theme.palette.primary[500],
    } as TextStyle,
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    } as ViewStyle,
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    } as ViewStyle,
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.text.primary,
        marginRight: 8,
        letterSpacing: 0.2,
    } as TextStyle,
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: radius.full,
        borderWidth: 1,
    } as ViewStyle,
    statusText: {
        fontSize: 9,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    } as TextStyle,
    subtextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    } as ViewStyle,
    subtext: {
        fontSize: 12,
        color: theme.text.secondary,
        marginLeft: 6,
    } as TextStyle,
    actionButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    } as ViewStyle,

    // --- Empty State --- //
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.background.subtle,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.border.subtle,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.text.primary,
        marginBottom: 8,
        letterSpacing: 0.3,
    } as TextStyle,
    emptyText: {
        fontSize: 14,
        color: theme.text.secondary,
        textAlign: 'center',
        maxWidth: 260,
        lineHeight: 20,
    } as TextStyle,

    // --- FAB --- //
    fabContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        shadowColor: theme.palette.primary[500],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    fabGradient: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderRadius: 30,
        alignItems: 'center',
    },
    fabText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 15,
        marginLeft: 10,
        letterSpacing: 0.5,
    } as TextStyle,
});
