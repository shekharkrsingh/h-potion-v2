import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { lightColors } from '@/theme/colors';

const { palette } = lightColors;

export const styles = StyleSheet.create({
    container: {
        height: 64,
        width: 64,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.m,
        backgroundColor: palette.primary[500],
        shadowColor: palette.neutral[950],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    text: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: 'bold',
        color: palette.neutral[0],
    }
});
