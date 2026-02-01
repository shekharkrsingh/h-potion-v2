import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        marginBottom: spacing.xl,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
        marginTop: spacing.s,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: theme.border.default,
    },
    orText: {
        marginHorizontal: spacing.l,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xl,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border.default,
        backgroundColor: theme.background.card,
    },
    icon: {
        width: 24,
        height: 24,
    },
    appleIcon: {
        tintColor: theme.text.primary,
    }
});
