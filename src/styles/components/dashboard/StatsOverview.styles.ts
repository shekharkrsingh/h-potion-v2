import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        marginBottom: spacing.l,
        backgroundColor: 'transparent',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.l,
        gap: spacing.m,
        backgroundColor: 'transparent',
    },
    cardWrapper: {
        width: '47%', // Approx 50% minus half gap
        flexGrow: 1,
        backgroundColor: 'transparent',
    }
});
