import React, { useState, useMemo, useRef } from 'react';
import { View, TouchableOpacity, Animated, Alert, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ChevronLeft, QrCode, Mail, Download, Share2, ShieldCheck, Zap, CreditCard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/theme/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { Text } from '@/components/ui/Text';
import { createStyles } from '@/styles/screens/DoctorCardScreen.styles';
import { resourceService, ReportResult } from '@/services/resourceService';
import { uint8ArrayToBase64 } from '@/utils/file';
import { haptics } from '@/utils/haptics';
import { RootState } from '@/store';

const DOWNLOAD_DIR_KEY = 'hpotion_download_dir_shared';

export default function DoctorCardScreen() {
    const { theme } = useTheme();
    const { showToast } = useToast();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const styles = useMemo(() => createStyles(theme, insets), [theme, insets]);

    // Redux State
    const profile = useSelector((state: RootState) => state.profile.data);

    // Local State
    const [isGenerating, setIsGenerating] = useState(false);
    const [cardResult, setCardResult] = useState<ReportResult | null>(null);

    // Animations
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        haptics.impact();

        try {
            const result = await resourceService.getDoctorCard();
            setCardResult(result);
            haptics.impact();

            Alert.alert("Success", "Your doctor card has been generated and sent to your email.");

            // Auto-trigger download for Android
            const targetUri = await AsyncStorage.getItem(DOWNLOAD_DIR_KEY);
            if (targetUri && Platform.OS === 'android') {
                try {
                    const base64 = uint8ArrayToBase64(result.pdfData);
                    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(targetUri, result.fileName, 'application/pdf');
                    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    showToast('Auto-saved to "HPotion"', 'success');
                } catch (e) {
                    // silent fail
                }
            }
        } catch (err: any) {
            Alert.alert("Generation Failed", err.message);
            haptics.error();
        } finally {
            setIsGenerating(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    const downloadPdf = async () => {
        if (!cardResult) return;
        haptics.impact();

        try {
            const { pdfData, fileName } = cardResult;

            if (Platform.OS === 'web') {
                const blob = new Blob([pdfData as any], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                showToast('Download started', 'success');
            } else if (Platform.OS === 'android') {
                let targetUri = await AsyncStorage.getItem(DOWNLOAD_DIR_KEY);

                const saveToUri = async (uri: string) => {
                    const base64 = uint8ArrayToBase64(pdfData);
                    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(uri, fileName, 'application/pdf');
                    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    return fileUri;
                };

                if (targetUri) {
                    try {
                        showToast('Downloading credential...', 'info');
                        await saveToUri(targetUri);
                        setTimeout(() => showToast('Saved to "HPotion"', 'success'), 500);
                        return;
                    } catch (e) {
                        await AsyncStorage.removeItem(DOWNLOAD_DIR_KEY);
                        targetUri = null;
                    }
                }

                if (!targetUri) {
                    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
                        FileSystem.StorageAccessFramework.getUriForDirectoryInRoot("Documents")
                    );
                    if (!permissions.granted) return;

                    let folderUri = permissions.directoryUri;
                    try {
                        folderUri = await FileSystem.StorageAccessFramework.makeDirectoryAsync(permissions.directoryUri, 'HPotion');
                    } catch (e) { /* already exists */ }

                    await AsyncStorage.setItem(DOWNLOAD_DIR_KEY, folderUri);
                    await saveToUri(folderUri);
                    showToast('Saved to "HPotion"', 'success');
                }
            } else {
                // iOS
                if (await Sharing.isAvailableAsync()) {
                    const cacheDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
                    const fileUri = `${cacheDir}${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
                    const base64 = uint8ArrayToBase64(pdfData);
                    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    await Sharing.shareAsync(fileUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
                    showToast('Credential exported', 'success');
                }
            }
        } catch (err: any) {
            showToast(err.message || 'Download Failed', 'error');
        }
    };

    const sharePdf = async () => {
        if (!cardResult) return;
        haptics.selection();

        try {
            const { pdfData, fileName } = cardResult;
            const cacheDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
            const fileUri = `${cacheDir}${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const base64 = uint8ArrayToBase64(pdfData);
            await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
            }
        } catch (err: any) {
            showToast(err.message || 'Share Error', 'error');
        }
    };

    return (
        <View style={styles.container}>
            {/* Minimalist Floating Back Button */}
            <TouchableOpacity onPress={() => router.back()} style={styles.floatingBackButton}>
                <ChevronLeft size={24} color={theme.text.primary} />
            </TouchableOpacity>

            <Animated.ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text style={styles.heroTitle}>Verified Identity</Text>
                    <Text style={styles.heroSubtitle}>Professional digital credential for secure medical verification.</Text>
                </View>

                {/* Structured Identity Card */}
                <View style={styles.cardWrapper}>
                    <LinearGradient
                        colors={theme.mode === 'dark'
                            ? ['#0f172a', '#1e293b']
                            : ['#f8fafc', '#f1f5f9']}
                        style={styles.cardMainGradient}
                    />
                    <View style={styles.cardPattern} />

                    <View style={styles.cardContent}>
                        <View style={styles.cardLogo}>
                            <CreditCard size={24} color={theme.palette.primary[500]} />
                        </View>

                        <View style={styles.qrContainer}>
                            <View style={styles.qrPlaceholder}>
                                {isGenerating ? (
                                    <ActivityIndicator size="large" color={theme.palette.primary[500]} />
                                ) : (
                                    <QrCode size={120} color="#0f172a" />
                                )}
                            </View>
                        </View>

                        <View style={styles.doctorInfo}>
                            <View style={styles.doctorBadge}>
                                <Text style={styles.doctorBadgeText}>Verified Surgeon</Text>
                            </View>
                            <Text style={styles.doctorName}>
                                {profile ? `Dr. ${profile.firstName} ${profile.lastName}` : 'Dr. H-Potion User'}
                            </Text>
                            <Text style={styles.doctorSpecialty}>
                                {profile?.specialization || 'Medical Specialist'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Professional Perks */}
                <View style={styles.perksGrid}>
                    <View style={styles.perkPod}>
                        <ShieldCheck size={20} color={theme.palette.primary[500]} />
                        <Text style={styles.perkTitle}>Secure Verification</Text>
                        <Text style={styles.perkDesc}>Encrypted QR technology for clinical trust.</Text>
                    </View>
                    <View style={styles.perkPod}>
                        <Zap size={20} color={theme.palette.primary[500]} />
                        <Text style={styles.perkTitle}>Instant Integration</Text>
                        <Text style={styles.perkDesc}>Seamless booking through verified scanning.</Text>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Action Bar */}
            <View style={[styles.actionCapsule, { marginBottom: insets.bottom || 20 }]}>
                <TouchableOpacity
                    style={styles.mainAction}
                    onPress={handleGenerate}
                    disabled={isGenerating}
                >
                    <LinearGradient
                        colors={[theme.palette.primary[500], theme.palette.primary[600]]}
                        style={styles.mainActionGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        {isGenerating ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Mail size={18} color="#FFF" />
                                <Text style={styles.mainActionText}>Generate Credential</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconAction, !cardResult && { opacity: 0.3 }]}
                    onPress={downloadPdf}
                    disabled={!cardResult}
                >
                    <Download size={20} color={theme.text.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconAction, !cardResult && { opacity: 0.3 }]}
                    onPress={sharePdf}
                    disabled={!cardResult}
                >
                    <Share2 size={20} color={theme.text.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
