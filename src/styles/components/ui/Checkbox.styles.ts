import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.m,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.s,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        flex: 1,
    },
    errorText: {
        marginLeft: 28,
        marginTop: 2,
    }
});
