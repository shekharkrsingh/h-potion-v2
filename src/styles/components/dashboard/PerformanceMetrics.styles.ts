import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.l,
        paddingHorizontal: spacing.l,
    },
    grid: {
        flexDirection: 'row',
        gap: spacing.m,
    },
    metricItem: {
        flex: 1,
        padding: spacing.m,
        borderRadius: radius.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
    },
});
