import { StyleSheet } from 'react-native';
import type { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export const createStyles = (theme: ColorTheme) => {
    // Safety check - though TypeScript should prevent this
    if (!theme) {
        console.error("Theme is undefined in createStyles!");
    }

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.default,
        },
        background: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        header: {
            paddingHorizontal: spacing.l,
            paddingTop: spacing.xl,
            paddingBottom: spacing.m,
            // backgroundColor: theme.background.default, // REMOVED to let image show through
        },
        headerTopRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.xs,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '800',
            color: theme.text.primary,
            letterSpacing: 0.3,
        },
        listContent: {
            padding: spacing.l,
            paddingBottom: 100,
        },
        headerSubTitle: {
            marginTop: 4,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        // ... existing styles
        filterContainer: {
            paddingBottom: spacing.s,
            borderBottomWidth: 1,
            borderBottomColor: 'transparent',
        },
        filterContent: {
            paddingHorizontal: spacing.l,
            paddingBottom: spacing.s,
        },
        filterChip: {
            paddingHorizontal: spacing.m,
            paddingVertical: spacing.xs,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: theme.border.subtle,
            backgroundColor: theme.background.card,
            marginRight: spacing.s,
        },
        sectionHeader: {
            backgroundColor: 'transparent',
            paddingTop: spacing.l,
            paddingBottom: spacing.s,
            marginTop: spacing.s,
        },
        sectionHeaderText: {
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            opacity: 0.8,
        },
    });
};
