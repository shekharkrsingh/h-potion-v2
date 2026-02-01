import { StyleSheet, Dimensions, Platform } from 'react-native';
import { ColorTheme } from '@/theme/colors';
import { getGlassStyle } from '@/styles/common';

const { width } = Dimensions.get('window');
export const SCANNER_SIZE = Math.round(width * 0.7);

import { EdgeInsets } from 'react-native-safe-area-context';

export const createStyles = (theme: ColorTheme, insets: EdgeInsets) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        backgroundColor: theme.background.default,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.status.error + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    title: {
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        textAlign: 'center',
        color: theme.text.secondary,
        marginBottom: 30
    },
    primaryButton: {
        backgroundColor: theme.palette.primary[500],
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600'
    },
    secondaryButton: {
        marginTop: 20
    },
    secondaryButtonText: {
        color: theme.text.tertiary
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: insets.top || 10,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16
    },
    // --- DARKROOM OVERLAY ---
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 5,
    },
    overlayRow: {
        flexDirection: 'row',
    },
    overlayMask: {
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    // Center "Hole" is transparent, handled by layout in TSX

    // --- SCANNER FRAME ---
    scannerWrapper: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    scannerFrame: {
        width: SCANNER_SIZE,
        height: SCANNER_SIZE,
        position: 'relative',
    },

    // --- BREATHING CORNERS ---
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: theme.palette.primary[500],
        borderWidth: 5,
        borderRadius: 12,
        shadowColor: theme.palette.primary[500],
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 5,
    },
    tl: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0 },
    tr: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0 },
    bl: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0 },
    br: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0 },

    // --- LASER GRADIENT ---
    scanLine: {
        width: '100%',
        height: 60, // Taller for gradient trail
        position: 'absolute',
    },
    laserContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        borderRadius: 12,
    },
    laserGradient: {
        flex: 1,
        width: '100%',
    },

    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20
    },

    instructionContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 11,
        paddingTop: SCANNER_SIZE + 100, // Position it below the scanner hole
    },
    instructionText: {
        color: 'rgba(255,255,255,0.9)',
        marginTop: 40,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500',
        textShadowColor: 'rgba(0,0,0,0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },

    // --- GLASS CAPSULE CONTROLS ---
    controls: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 60 : 40,
        alignSelf: 'center',
        zIndex: 20,
    },
    controlBar: {
        flexDirection: 'row',
        ...getGlassStyle(theme),
        borderRadius: 40,
        padding: 6,
        gap: 8,
        overflow: 'hidden',
    },
    controlAction: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 10,
        borderRadius: 30,
    },
    controlText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 0.5
    },
    divider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        height: '60%',
    }
});
