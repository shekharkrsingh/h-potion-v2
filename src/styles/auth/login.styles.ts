import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    form: {
        width: '100%',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: spacing.l,
    }
});
