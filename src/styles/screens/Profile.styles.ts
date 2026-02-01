import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const createProfileScreenStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.default,
    },
    scrollContent: {
        paddingBottom: 100, // Space for tab bar
    },
    background: {
        flex: 1,
    },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.background.default,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 16,
        paddingHorizontal: 20,
        zIndex: 100,
        elevation: 4,
        shadowColor: theme.palette.neutral[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.subtle,
    },
    stickyHeaderContent: {
        flex: 1,
        alignItems: 'center',
    },
    sectionsWrapper: {
        marginTop: -10,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: theme.background.default,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        marginBottom: 8,
    },
    errorMessage: {
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: theme.palette.primary[500],
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    retryButtonText: {
        color: '#FFFFFF',
    },
    versionText: {
        textAlign: 'center',
        color: theme.text.tertiary,
        marginTop: spacing.xl,
        marginBottom: spacing.l,
    },
    // Extracted Styles
    aboutContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    aboutIcon: {
        width: 32,
        alignItems: 'center',
    },
    aboutText: {
        flex: 1,
        lineHeight: 22,
    },
    readMoreButton: {
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    detailsContainer: {
        gap: 4,
    },
    scrollContentNoPadding: {
        paddingTop: 0,
    }
});
