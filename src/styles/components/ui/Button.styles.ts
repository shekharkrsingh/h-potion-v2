import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999, // Pill shape
    },
    text: {
        marginHorizontal: spacing.s,
    }
});
