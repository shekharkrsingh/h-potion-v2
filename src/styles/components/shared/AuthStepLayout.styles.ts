import { StyleSheet, Dimensions } from 'react-native';
import { spacing } from '@/theme/spacing';
import { ColorTheme } from '@/theme/colors';

const { height } = Dimensions.get('window');

export const createStyles = (theme: ColorTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fallback
    },
    heroImage: {
        height: height * 0.45,
        width: '100%',
        justifyContent: 'flex-start',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    headerOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end', // Push content to bottom of the hero section
        paddingBottom: 0, // Handled inline
        zIndex: 5,
    },
    logoContainer: {
        marginBottom: spacing.m,
    },
    title: {
        marginBottom: spacing.xs,
        color: '#FFFFFF', // Force white on image
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.95)',
        paddingHorizontal: spacing.l,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    sheetContainer: {
        flex: 1,
        marginTop: -60, // Deepened overlap
        borderTopLeftRadius: 40, // Pronounced curve
        borderTopRightRadius: 40, // Pronounced curve
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.08,
        shadowRadius: 16,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.xl,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xxxl,
    },
    backButton: {
        position: 'absolute',
        left: spacing.l,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    helpButton: {
        position: 'absolute',
        right: spacing.l,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    content: {
        marginBottom: spacing.l,
    },
    actions: {
        marginBottom: spacing.l,
    },
    socialSection: {
        marginBottom: spacing.l,
    },
    footer: {
        alignItems: 'center',
    },
    secondaryButton: {
        marginTop: spacing.s,
    },
});
