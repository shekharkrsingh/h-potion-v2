import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: spacing.m,
        borderRadius: radius.m,
        marginBottom: spacing.m,
        alignItems: 'center',
        ...getGlassStyle(theme),
    },
    timeContainer: {
        alignItems: 'center',
        paddingRight: spacing.m,
        borderRightWidth: 1,
        borderRightColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        marginRight: spacing.m,
        minWidth: 60,
    },
    time: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    ampm: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
    detailsContainer: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.xs / 2,
    },
    statusBadge: {
        paddingHorizontal: spacing.s,
        paddingVertical: 2,
        borderRadius: radius.s,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
        gap: 4,
    },
    typeText: {
        fontSize: 12,
    },
    actionButton: {
        padding: spacing.s,
        borderRadius: radius.full,
    }
});
