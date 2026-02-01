import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { typography } from '@/theme/typography';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    text: {
        fontSize: 14,
        fontFamily: typography.fontFamily.bold,
        padding: 0,
        margin: 0,
        color: theme.text.primary,
    }
});
