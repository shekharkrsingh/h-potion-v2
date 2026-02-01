import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    miniIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.s,
    },
    description: {
        marginTop: 2,
    }
});
