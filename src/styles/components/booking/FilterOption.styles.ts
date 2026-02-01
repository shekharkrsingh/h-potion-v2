import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        borderRadius: 10,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelContainer: {
        marginLeft: spacing.s,
    },
    labelText: {
        fontSize: 13,
    },
    checkmark: {
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
