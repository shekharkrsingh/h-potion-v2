import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        gap: spacing.m,
    },
    footer: {
        marginTop: spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resendButton: {
        marginLeft: spacing.xs,
    },
});
