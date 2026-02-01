import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: spacing.m,
    },
    label: {
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        height: '100%',
        paddingRight: spacing.m,
        fontSize: 16,
    },
    leftIconContainer: {
        paddingHorizontal: spacing.s,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightIconContainer: {
        paddingHorizontal: spacing.s,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: 4,
    }
});
