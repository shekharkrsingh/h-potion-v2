import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { getGlassStyle } from '@/styles/common';

export const createStyles = (theme: ColorTheme, isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.canvas,
    },
    background: {
        flex: 1,
    },
    backgroundImage: {
        opacity: isDark ? 0.3 : 0.5,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
        alignItems: 'center',
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 800,
    },
    noDataContainer: {
        marginHorizontal: spacing.l,
        marginTop: spacing.l,
        marginBottom: spacing.m,
        padding: spacing.l,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        ...getGlassStyle(theme),
    },
    noDataTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.text.primary,
        marginBottom: spacing.s,
        textAlign: 'center',
    },
    noDataSubtitle: {
        fontSize: 14,
        color: theme.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    errorContainer: {
        padding: spacing.m,
        backgroundColor: theme.status.errorBg,
        margin: spacing.m,
        borderRadius: 8,
    },
    errorText: {
        color: theme.status.error,
    },
});
