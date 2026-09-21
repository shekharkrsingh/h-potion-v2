import { StyleSheet } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardView: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    dialogContainer: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.background.modal,
        borderRadius: radius.xl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        // High-end shadows for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.3,
        shadowRadius: 32,
        elevation: 24,
    },
    closeButton: {
        position: 'absolute',
        top: spacing.m,
        right: spacing.m,
        padding: spacing.s,
        zIndex: 10,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: spacing.l,
    },
    contentContainer: {
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.xs,
        color: theme.text.primary,
    },
    description: {
        textAlign: 'center',
        color: theme.text.secondary,
        marginBottom: spacing.l,
        lineHeight: 22,
    },
    customChildrenContainer: {
        width: '100%',
        marginBottom: spacing.l,
    },
    actionsContainer: {
        width: '100%',
        gap: spacing.m,
    },
    actionRow: {
        flexDirection: 'row',
        gap: spacing.m,
    },
    actionCol: {
        flexDirection: 'column',
        gap: spacing.m,
    },
    actionFlex: {
        flex: 1,
    }
});
