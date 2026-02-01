import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

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
        paddingBottom: 100,
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
