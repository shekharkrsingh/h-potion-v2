import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    otpInput: {
        letterSpacing: spacing.s,
        fontSize: 24,
        paddingLeft: spacing.m,
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
