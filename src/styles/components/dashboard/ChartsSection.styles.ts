import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        marginBottom: spacing.l,
        paddingHorizontal: spacing.l,
    },
    chartContainer: {
        marginBottom: spacing.l,
        padding: spacing.m,
        borderRadius: radius.l,
        ...getGlassStyle(theme),
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    chartWrapper: {
        marginTop: spacing.s,
        alignItems: 'center',
    },
    tooltipContainer: {
        backgroundColor: theme.mode === 'dark' ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        padding: spacing.m,
        borderRadius: radius.m,
        borderWidth: 1.5,
        borderColor: theme.palette.primary[500],
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: -50 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    tooltipValue: {
        color: theme.text.primary,
        fontSize: 14,
    },
    tooltipLabel: {
        color: theme.text.secondary,
        marginTop: spacing.xs,
    },
    legendContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: spacing.m,
        gap: spacing.m,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    centerLabelContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerLabelValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.text.primary,
        lineHeight: 24,
    },
    centerLabelText: {
        fontSize: 12,
        color: theme.text.secondary,
        marginTop: -2,
    },
});
