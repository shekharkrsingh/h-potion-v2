import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Alert,
    ActivityIndicator,
    Animated,
    Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { RotateCcw, Zap, ZapOff, CameraOff, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { haptics } from '@/utils/haptics';
import { createStyles, SCANNER_SIZE } from '@/styles/screens/QRScannerScreen.styles';

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL || 'https://hpotion.netlify.app';

// --- Constants & Types --- //
const baseUrl = WEB_APP_URL.endsWith('/') ? WEB_APP_URL.slice(0, -1) : WEB_APP_URL;

const URL_PATTERNS = [
    // Pattern 1: /appointment?appointmentid=XXX
    new RegExp(`${baseUrl}/appointment\\?appointmentid=([\\w-]+)`, 'i'),
    // Pattern 2: /appointment?appointmentId=XXX (different casing)
    new RegExp(`${baseUrl}/appointment\\?appointmentId=([\\w-]+)`, 'i'),
    // Pattern 3: /appointments/XXX (RESTful style)
    new RegExp(`${baseUrl}/appointments?/([\\w-]+)`, 'i'),
];

const APPOINTMENT_ID_PATTERN = /^[\w-]+$/;

type QRScanResult = {
    type: 'appointment' | 'unknown';
    data: string;
    id?: string;
    timestamp: Date;
};

const parseQRCodeData = (scannedData: string): QRScanResult => {
    console.log('[QR Scanner] Scanned data:', scannedData);

    try {
        const trimmedData = scannedData.trim();

        // Try all URL patterns
        for (const pattern of URL_PATTERNS) {
            const match = trimmedData.match(pattern);
            if (match && match[1]) {
                console.log('[QR Scanner] ✅ Valid appointment URL - ID:', match[1]);
                return { type: 'appointment', data: trimmedData, id: match[1], timestamp: new Date() };
            }
        }

        // Direct ID fallback
        if (APPOINTMENT_ID_PATTERN.test(trimmedData)) {
            console.log('[QR Scanner] ✅ Valid appointment ID:', trimmedData);
            return { type: 'appointment', data: trimmedData, id: trimmedData, timestamp: new Date() };
        }

        console.log('[QR Scanner] ❌ Invalid QR code format');
    } catch (error) {
        console.error('[QR Scanner] Parse error:', error);
    }

    return { type: 'unknown', data: scannedData, timestamp: new Date() };
};

export default function QRScannerScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme, isDark } = useTheme();
    const styles = useMemo(() => createStyles(theme, insets), [theme, insets]);

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
    const [cameraType, setCameraType] = useState<CameraType>('back');

    // Animation Values
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Breathing Animation
    const breathAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!permission) requestPermission();

        // 1. Scan Line Animation
        const laserAnim = Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true })
            ])
        );
        laserAnim.start();

        // 2. Breathing Corners Animation
        const breatheLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(breathAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
                Animated.timing(breathAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
            ])
        );
        breatheLoop.start();

        return () => {
            laserAnim.stop();
            breatheLoop.stop();
        };
    }, [permission]);

    const shake = React.useCallback(() => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    }, [shakeAnim]);

    const handleQRCodeScanned = React.useCallback(async ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);
        setIsProcessing(true);

        const result = parseQRCodeData(data);

        if (result.type === 'appointment' && result.id) {
            haptics.impact(); // Success feedback
            setIsSuccess(true);
            setTimeout(() => {
                setIsProcessing(false);
                router.push({
                    pathname: '/(tabs)/appointments/details/[id]',
                    params: { id: result.id! }
                });
            }, 800);
        } else {
            haptics.error();
            shake(); // Shake screen
            setIsProcessing(false);

            // Allow rescanning after a short delay
            setTimeout(() => {
                setScanned(false);
            }, 1000);
        }
    }, [scanned, router, shake]);

    if (!permission) return <SafeAreaView style={[styles.container, { backgroundColor: '#000' }]} />;

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.permissionContainer}>
                <View style={styles.iconCircle}>
                    <CameraOff size={40} color={theme.status.error} />
                </View>
                <Text variant="h3" style={styles.title}>Camera Access Required</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    We need permission to access your camera to scan appointment QR codes.
                </Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    style={styles.primaryButton}
                >
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.back()} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <CameraView
                style={StyleSheet.absoluteFill}
                facing={cameraType}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={scanned ? undefined : handleQRCodeScanned}
                enableTorch={flashMode === 'on'}
            />

            {/* --- Darkroom Overlay --- */}
            <View style={styles.overlay} pointerEvents="box-none">
                {/* Top spacer */}
                <View style={[styles.overlayMask, { flex: 1, width: '100%' }]} />

                <View style={styles.overlayRow} pointerEvents="box-none">
                    {/* Left spacer */}
                    <View style={[styles.overlayMask, { flex: 1, height: SCANNER_SIZE }]} />

                    {/* The "Hole" */}
                    <View style={{ width: SCANNER_SIZE, height: SCANNER_SIZE }} pointerEvents="none" />

                    {/* Right spacer */}
                    <View style={[styles.overlayMask, { flex: 1, height: SCANNER_SIZE }]} />
                </View>

                {/* Bottom spacer */}
                <View style={[styles.overlayMask, { flex: 1, width: '100%' }]} />
            </View>

            {/* --- Scanner Frame & Animation (Absolute Centered) --- */}
            <View style={styles.scannerWrapper} pointerEvents="none">
                <Animated.View style={[
                    styles.scannerFrame,
                    { transform: [{ translateX: shakeAnim }, { scale: breathAnim }] }
                ]}>
                    {/* Corners */}
                    <View style={[styles.corner, styles.tl]} />
                    <View style={[styles.corner, styles.tr]} />
                    <View style={[styles.corner, styles.bl]} />
                    <View style={[styles.corner, styles.br]} />

                    {/* Cyberpunk Laser Gradient - Clipped to Frame */}
                    {!isSuccess && (
                        <View style={styles.laserContainer}>
                            <Animated.View style={[
                                styles.scanLine,
                                {
                                    top: -60, // Start above the frame
                                    transform: [{
                                        translateY: scanLineAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, SCANNER_SIZE + 60] // Move full height + tail
                                        })
                                    }]
                                }
                            ]}>
                                <LinearGradient
                                    colors={['rgba(14, 165, 233, 0)', 'rgba(14, 165, 233, 0.3)', theme.palette.primary[500]]}
                                    style={styles.laserGradient}
                                />
                            </Animated.View>
                        </View>
                    )}

                    {/* Processing Indicator */}
                    {isProcessing && (
                        <View style={styles.processingOverlay}>
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                </Animated.View>
            </View>

            {/* Instruction Text (Absolute Positioned relative to frame) */}
            <View style={styles.instructionContainer} pointerEvents="none">
                <Text style={styles.instructionText}>
                    Align the QR code within the frame
                </Text>
            </View>

            {/* --- Active UI Layer --- */}
            <SafeAreaView style={[StyleSheet.absoluteFill, { zIndex: 100 }]} pointerEvents="box-none">

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={[styles.iconButton, { backgroundColor: theme.background.modal, borderWidth: 1, borderColor: theme.border.subtle }]}
                    >
                        <X size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <View style={[styles.titleContainer, { backgroundColor: theme.background.modal, borderWidth: 1, borderColor: theme.border.subtle }]}>
                        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Scan QR Code</Text>
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                {/* High-Contrast Control Bar */}
                <View style={styles.controls}>
                    <View style={[styles.controlBar, { backgroundColor: theme.background.modal, borderWidth: 1, borderColor: theme.border.subtle }]}>
                        <TouchableOpacity
                            style={styles.controlAction}
                            onPress={() => setFlashMode(p => p === 'off' ? 'on' : 'off')}
                        >
                            {flashMode === 'on' ? (
                                <Zap size={20} color={theme.palette.warning[500]} fill={theme.palette.warning[500]} />
                            ) : (
                                <ZapOff size={20} color={theme.text.primary} />
                            )}
                            <Text style={[styles.controlText, { color: theme.text.primary }]}>Flash</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.controlAction}
                            onPress={() => setCameraType(p => p === 'back' ? 'front' : 'back')}
                        >
                            <RotateCcw size={20} color={theme.text.primary} />
                            <Text style={[styles.controlText, { color: theme.text.primary }]}>Flip</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaView>
        </View>
    );
}
