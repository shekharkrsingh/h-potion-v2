import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Alert,
    Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { RotateCcw, Zap, ZapOff, X, CameraOff } from 'lucide-react-native';
import { BlurView, BlurTargetView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { haptics } from '@/utils/haptics';
import { createStyles, SCANNER_SIZE } from '@/styles/screens/QRScannerScreen.styles';

const WEB_APP_URL = process.env.EXPO_PUBLIC_WEB_APP_URL || 'https://hpotion.netlify.app';

// --- Constants & Types --- //
const baseUrl = WEB_APP_URL.endsWith('/') ? WEB_APP_URL.slice(0, -1) : WEB_APP_URL;

const URL_PATTERNS = [
    new RegExp(`${baseUrl}/appointment\\?appointmentid=([\\w-]+)`, 'i'),
    new RegExp(`${baseUrl}/appointment\\?appointmentId=([\\w-]+)`, 'i'),
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
    try {
        const trimmedData = scannedData.trim();
        for (const pattern of URL_PATTERNS) {
            const match = trimmedData.match(pattern);
            if (match && match[1]) {
                return { type: 'appointment', data: trimmedData, id: match[1], timestamp: new Date() };
            }
        }
        if (APPOINTMENT_ID_PATTERN.test(trimmedData)) {
            return { type: 'appointment', data: trimmedData, id: trimmedData, timestamp: new Date() };
        }
    } catch (error) {
        // Ignore
    }
    return { type: 'unknown', data: scannedData, timestamp: new Date() };
};

export default function QRScannerScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const styles = useMemo(() => createStyles(theme, { top: 0, bottom: 0, left: 0, right: 0 }), [theme]);

    // Camera State
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
    const [flashMode, setFlashMode] = useState<'on' | 'off'>('off');
    const [isSuccess, setIsSuccess] = useState(false);

    // Animation Values
    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const breathAnim = useRef(new Animated.Value(1)).current;
    
    // Blur Target Ref for Android Camera View
    const blurTargetRef = useRef(null);

    useEffect(() => {
        if (!permission) requestPermission();
    }, [permission]);

    // Scanner Laser & Breathing Animation
    useEffect(() => {
        // Laser Line
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(scanLineAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Continuous Breathing (Pulsing)
        Animated.loop(
            Animated.sequence([
                Animated.timing(breathAnim, { toValue: 1.02, duration: 750, useNativeDriver: true }),
                Animated.timing(breathAnim, { toValue: 1, duration: 750, useNativeDriver: true })
            ])
        ).start();
    }, []);

    const triggerSuccessAnimation = () => {
        setIsSuccess(true);
        Animated.sequence([
            Animated.timing(breathAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
            Animated.timing(breathAnim, { toValue: 1, duration: 150, useNativeDriver: true })
        ]).start();
    };

    const triggerErrorAnimation = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    };

    const handleQRCodeScanned = ({ data }: { data: string }) => {
        if (scanned || isProcessing) return;
        setScanned(true);
        setIsProcessing(true);
        haptics.success();

        const result = parseQRCodeData(data);

        if (result.type === 'appointment' && result.id) {
            triggerSuccessAnimation();
            setTimeout(() => {
                setIsProcessing(false);
                router.push({
                    pathname: '/appointments/details/[id]',
                    params: { id: result.id! }
                });
            }, 800);
        } else {
            haptics.error();
            triggerErrorAnimation();
            
            // Seamlessly reset the scanner after the shake animation finishes
            setTimeout(() => {
                setScanned(false);
                setIsProcessing(false);
            }, 1200);
        }
    };

    if (!permission?.granted) {
        return (
            <SafeAreaView style={styles.permissionContainer}>
                <CameraOff size={64} color={theme.text.muted} style={{ marginBottom: 24 }} />
                <Text variant="h3" style={styles.title}>Camera Access Required</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>
                    We need access to your camera to scan appointment QR codes.
                </Text>
                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: theme.palette.primary[500] }]}
                    onPress={requestPermission}
                >
                    <Text style={styles.buttonText}>Allow Camera Access</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <BlurTargetView ref={blurTargetRef} style={StyleSheet.absoluteFill}>
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing={cameraType}
                    autofocus="on"
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                    onBarcodeScanned={scanned ? undefined : handleQRCodeScanned}
                    enableTorch={flashMode === 'on'}
                />
            </BlurTargetView>

            {/* --- ULTIMATE REDESIGN: MASKED VIEW + GIANT BORDER TRICK --- */}
            <MaskedView
                style={[StyleSheet.absoluteFill, { zIndex: 5 }]}
                maskElement={
                    <View style={StyleSheet.absoluteFill}>
                        <Animated.View style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: SCANNER_SIZE + 2000,
                            height: SCANNER_SIZE + 2000,
                            marginTop: -(SCANNER_SIZE + 2000) / 2,
                            marginLeft: -(SCANNER_SIZE + 2000) / 2,
                            borderColor: 'black', // Opaque = Blur is visible
                            borderWidth: 1000,
                            backgroundColor: 'transparent', // Transparent = Hole is punched out
                            borderRadius: 1020, // 1000 border + 20 inner radius
                            transform: [{ translateX: shakeAnim }, { scale: breathAnim }]
                        }} />
                    </View>
                }
            >
                {/* The blur effect that gets masked */}
                <BlurView blurTarget={blurTargetRef} blurMethod="dimezisBlurView" intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
                {/* Fallback solid overlay for older Androids where dimezisBlurView is 'none' */}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
            </MaskedView>

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

                    {!isSuccess && (
                        <View style={styles.laserContainer}>
                            <Animated.View style={[
                                styles.scanLine,
                                {
                                    top: -60,
                                    transform: [{
                                        translateY: scanLineAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, SCANNER_SIZE + 60]
                                        })
                                    }]
                                }
                            ]}>
                                <View style={styles.laserGradient} />
                            </Animated.View>
                        </View>
                    )}
                </Animated.View>
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

                        <View style={[styles.divider, { backgroundColor: theme.border.subtle }]} />

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
