import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});
