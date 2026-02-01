import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';

const { width } = Dimensions.get('window');

export const createStyles = (theme: ColorTheme, bottomInset: number) => StyleSheet.create({
    wrapper: {
        backgroundColor: theme.background.card,
        borderTopWidth: 1,
        borderTopColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        paddingBottom: Math.max(bottomInset, spacing.s),
        paddingHorizontal: spacing.m,
        height: 64 + Math.max(bottomInset, spacing.s),
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
    tabItem: {
        flex: 1,
        paddingTop: spacing.m,
        paddingBottom: spacing.xs,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtonContainer: {
        width: 52,
        height: 52,
        borderRadius: radius.m,
        backgroundColor: theme.palette.primary[500],
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: theme.palette.primary[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    indicator: {
        height: 2,
        width: 16,
        borderRadius: 1,
        backgroundColor: theme.icon.active,
        marginTop: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
    },
});
