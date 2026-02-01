import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const createEmptyStateStyles = (theme: ColorTheme) => StyleSheet.create({
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        marginTop: 64,
    },
    emptyStateIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.background.subtle,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
});
