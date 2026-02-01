import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';

export const createEditProfileStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.canvas,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        backgroundColor: theme.background.default,
        borderBottomWidth: 1,
        borderBottomColor: theme.border.subtle,
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: radius.full,
        backgroundColor: theme.background.subtle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
        color: theme.text.primary,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: spacing.xxl,
    },
    categoryTitle: {
        fontSize: 12,
        fontFamily: typography.fontFamily.bold,
        color: theme.text.tertiary,
        marginLeft: spacing.xl,
        marginTop: spacing.xl,
        marginBottom: spacing.s,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },

    // Modal Specific
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.mode === 'dark' ? 'rgba(23, 23, 23, 0.98)' : theme.background.default,
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        paddingTop: spacing.l,
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.xxl + 20, // Approximate inset, will verify
        borderWidth: 1,
        borderColor: theme.border.subtle,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: theme.border.subtle,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.l,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: typography.fontFamily.bold,
        color: theme.text.primary,
    },
    placeholderIcon: {
        width: 40, // Match backButton width
    }
});
