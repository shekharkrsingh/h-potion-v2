import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';
import { radius } from '@/theme/radius';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        marginBottom: spacing.l,
    },
    list: {
        paddingHorizontal: spacing.l,
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.m + 2,
        // Make it pill-shaped for a more modern, aesthetic look
        borderRadius: radius.full,
        marginTop: spacing.xl,
        marginHorizontal: spacing.m,
        gap: spacing.s,
        // Fallback background color in case gradient fails or is slow
        backgroundColor: theme.palette.primary[theme.mode === 'dark' ? 700 : 500],
        // Premium shadow for the floating effect
        shadowColor: theme.palette.primary[500],
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.2,
        shadowRadius: 20,
        elevation: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(14, 165, 233, 0.1)',
    },
    searchGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: radius.full,
    },
    searchText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.8,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    emptyStateText: {
        marginTop: spacing.m,
    }
});

// Helper for gradient colors - exported separately as a tuple for LinearGradient compatibility
export const getSearchGradientColors = (theme: ColorTheme): [string, string] => {
    return theme.mode === 'dark'
        ? [theme.palette.primary[600], theme.palette.primary[800]]
        : [theme.palette.primary[400], theme.palette.primary[600]];
};
