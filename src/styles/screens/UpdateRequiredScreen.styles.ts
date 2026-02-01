import { StyleSheet, Dimensions } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

const { width, height } = Dimensions.get('window');

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.default,
    },
    heroContainer: {
        height: height * 0.45,
        width: '100%',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    contentScroll: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.m,
        paddingBottom: spacing.xxl,
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        borderRadius: radius.full,
        marginBottom: spacing.l,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.text.primary,
        textAlign: 'center',
        marginBottom: spacing.s,
    },
    subtitle: {
        fontSize: 16,
        color: theme.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    instructionCard: {
        width: '100%',
        backgroundColor: theme.background.subtle,
        borderRadius: radius.xl,
        padding: spacing.l,
        borderWidth: 1,
        borderColor: theme.border.default,
        marginBottom: spacing.xl,
    },
    instructionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.text.brand,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.m,
    },
    instructionText: {
        fontSize: 15,
        color: theme.text.secondary,
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        gap: spacing.m,
    },
    primaryButton: {
        height: 56,
        borderRadius: radius.l,
    },
    secondaryButton: {
        height: 56,
        borderRadius: radius.l,
    }
});
