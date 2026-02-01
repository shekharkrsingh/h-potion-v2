import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { ColorTheme } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

const { width } = Dimensions.get('window');

export const createStyles = (theme: ColorTheme, insets: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background.default,
    },
    scrollContent: {
        paddingTop: insets.top + 50, // Space for floating button and extra margin
        paddingHorizontal: spacing.l,
        paddingBottom: 40,
    },

    floatingBackButton: {
        position: 'absolute',
        top: insets.top + 8,
        left: spacing.l - 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
    } as ViewStyle,

    // Hero Section
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.text.primary,
        letterSpacing: -0.3,
        lineHeight: 30,
        marginBottom: 4,
    } as TextStyle,
    heroSubtitle: {
        fontSize: 14,
        color: theme.text.secondary,
        fontWeight: '400',
        marginBottom: 24,
        lineHeight: 20,
    } as TextStyle,

    // Section Headers
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.text.tertiary,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12,
        marginLeft: 4,
    } as TextStyle,

    podContainer: {
        marginBottom: 28,
    },

    // Clinical Dashboard (Formerly Presets)
    presetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    presetPod: {
        width: (width - spacing.l * 2 - 12) / 2,
        padding: 14,
        borderRadius: 16,
        backgroundColor: theme.background.card,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        alignItems: 'center',
    } as ViewStyle,
    presetIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: theme.palette.primary[500] + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    presetLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.text.primary,
        textAlign: 'center',
    } as TextStyle,

    // Structured Dossier Form
    formPod: {
        padding: 24,
        borderRadius: 20,
        backgroundColor: theme.background.card,
        borderWidth: 1,
        borderColor: theme.border.subtle,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: theme.mode === 'dark' ? 0.2 : 0.03,
        shadowRadius: 12,
        elevation: 4,
    } as ViewStyle,

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    inputField: {
        flex: 1,
        height: 52,
        borderRadius: 12,
        backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
        borderWidth: 1,
        borderColor: theme.border.subtle,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        gap: 6,
    },
    inputText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.text.primary,
    },
    placeholderText: {
        color: theme.text.tertiary,
    },

    generateBtn: {
        height: 56,
        borderRadius: 14,
        overflow: 'hidden',
        marginTop: 8,
    },
    generateGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    generateText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
    },

    // Success Dossier State
    readyPod: {
        padding: 24,
        borderRadius: 20,
        backgroundColor: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.05)' : '#f0fdf4',
        borderWidth: 1,
        borderColor: theme.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
        marginTop: 8,
    } as ViewStyle,
    readyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    readyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.status.success,
    } as TextStyle,
    readyDesc: {
        fontSize: 14,
        color: theme.text.secondary,
        lineHeight: 20,
        marginBottom: 20,
    } as TextStyle,

    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    downloadBtn: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: theme.status.success,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    shareBtn: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        backgroundColor: theme.background.card,
        borderWidth: 1,
        borderColor: theme.border.default,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    disabledBtn: {
        opacity: 0.3,
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '700',
    },

    // Clinical Guidelines
    infoPod: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
        marginTop: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: theme.text.secondary,
        fontWeight: '400',
    },
});
