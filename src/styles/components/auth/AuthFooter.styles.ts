import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        marginTop: spacing.xxl,
        alignItems: 'center',
        gap: spacing.xl,
    },
    promptContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        marginLeft: spacing.xs,
    },
    termsText: {
        paddingHorizontal: spacing.l,
    }
});
