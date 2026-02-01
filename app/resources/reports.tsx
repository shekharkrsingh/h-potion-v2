import React, { useState, useMemo, useRef } from 'react';
import { View, TouchableOpacity, Animated, RefreshControl, Alert, Platform, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, FileText, Calendar, Download, Share2, History, CalendarRange, FileCheck, CheckCircle, Info, X, LayoutDashboard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/theme/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { Text } from '@/components/ui/Text';
import { createStyles } from '@/styles/screens/ReportScreen.styles';
import { resourceService, ReportResult } from '@/services/resourceService';
import { uint8ArrayToBase64 } from '@/utils/file';
import { haptics } from '@/utils/haptics';

const DOWNLOAD_DIR_KEY = 'hpotion_download_dir_shared';

export default function ReportScreen() {
    const { theme } = useTheme();
    const { showToast } = useToast();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const styles = useMemo(() => createStyles(theme, insets), [theme, insets]);

    // Animations
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);

    // Date State
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    // Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportResult, setReportResult] = useState<ReportResult | null>(null);

    const handleDateChange = (event: any, selectedDate?: Date, type?: 'from' | 'to') => {
        if (Platform.OS === 'android') {
            setShowFromPicker(false);
            setShowToPicker(false);
        }

        if (selectedDate) {
            if (type === 'from') setFromDate(selectedDate);
            else setToDate(selectedDate);
        }
    };

    const displayDate = (date: Date | null) => {
        if (!date) return 'Select Date';
        const d = date.getDate().toString().padStart(2, '0');
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const y = date.getFullYear().toString().slice(-2);
        return `${d}/${m}/${y}`;
    };

    const handleGenerate = async (start?: Date, end?: Date) => {
        const queryStart = start || fromDate;
        const queryEnd = end || toDate;

        if (!queryStart) {
            Alert.alert("Date Required", "Please select at least a start date.");
            return;
        }

        setIsGenerating(true);
        haptics.impact();

        try {
            const result = await resourceService.getMedicalReport(queryStart!, queryEnd || undefined);
            setReportResult(result);
            haptics.impact();

            Alert.alert("Success", "Your medical report has been generated and sent to your email.");

            // Auto-trigger download logic for Android HPotion folder
            const targetUri = await AsyncStorage.getItem(DOWNLOAD_DIR_KEY);
            if (targetUri && Platform.OS === 'android') {
                try {
                    const base64 = uint8ArrayToBase64(result.pdfData);
                    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(targetUri, result.fileName, 'application/pdf');
                    await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
                    showToast('Auto-saved to "HPotion"', 'success');
                } catch (e) {
                    // silent fail on auto-save
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
        if (!reportResult) return;
        haptics.impact();

        try {
            const { pdfData, fileName } = reportResult;

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
                        showToast('Downloading dossier...', 'info');
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
                    showToast('Dossier exported', 'success');
                }
            }
        } catch (err: any) {
            showToast(err.message || 'Download Failed', 'error');
        }
    };

    const sharePdf = async () => {
        if (!reportResult) return;
        haptics.selection();

        try {
            const { pdfData, fileName } = reportResult;
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

    const handleQuickAction = (type: 'today' | 'yesterday' | 'month' | 'year') => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstOfYear = new Date(today.getFullYear(), 0, 1);

        switch (type) {
            case 'today': handleGenerate(today, today); break;
            case 'yesterday': handleGenerate(yesterday, yesterday); break;
            case 'month': handleGenerate(firstOfMonth, today); break;
            case 'year': handleGenerate(firstOfYear, today); break;
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
                    <Text style={styles.heroTitle}>Clinical Dossier</Text>
                    <Text style={styles.heroSubtitle}>Professional diagnostic reporting and history export.</Text>
                </View>

                {/* Dashboard: Quick Insights */}
                <View style={styles.podContainer}>
                    <Text style={styles.sectionTitle}>Quick Insights</Text>
                    <View style={styles.presetsGrid}>
                        <TouchableOpacity style={styles.presetPod} onPress={() => handleQuickAction('today')}>
                            <View style={styles.presetIcon}>
                                <History size={20} color={theme.palette.primary[500]} />
                            </View>
                            <Text style={styles.presetLabel}>Today</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.presetPod} onPress={() => handleQuickAction('yesterday')}>
                            <View style={styles.presetIcon}>
                                <Calendar size={20} color={theme.palette.primary[500]} />
                            </View>
                            <Text style={styles.presetLabel}>Yesterday</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.presetPod} onPress={() => handleQuickAction('month')}>
                            <View style={styles.presetIcon}>
                                <CalendarRange size={20} color={theme.palette.primary[500]} />
                            </View>
                            <Text style={styles.presetLabel}>This Month</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.presetPod} onPress={() => handleQuickAction('year')}>
                            <View style={styles.presetIcon}>
                                <LayoutDashboard size={20} color={theme.palette.primary[500]} />
                            </View>
                            <Text style={styles.presetLabel}>Annual Audit</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Structured Date Selector */}
                <View style={styles.podContainer}>
                    <Text style={styles.sectionTitle}>Custom Filter</Text>
                    <View style={styles.formPod}>
                        <View style={styles.inputRow}>
                            <TouchableOpacity style={styles.inputField} onPress={() => setShowFromPicker(true)}>
                                <Calendar size={18} color={theme.text.tertiary} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.inputText, !fromDate && styles.placeholderText]} numberOfLines={1} ellipsizeMode="tail">
                                        {fromDate ? displayDate(fromDate) : 'Start Date'}
                                    </Text>
                                </View>
                                {fromDate && (
                                    <TouchableOpacity onPress={() => setFromDate(null)}>
                                        <X size={16} color={theme.text.tertiary} />
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.inputField} onPress={() => setShowToPicker(true)}>
                                <Calendar size={18} color={theme.text.tertiary} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.inputText, !toDate && styles.placeholderText]} numberOfLines={1} ellipsizeMode="tail">
                                        {toDate ? displayDate(toDate) : 'End Date (Optional)'}
                                    </Text>
                                </View>
                                {toDate && (
                                    <TouchableOpacity onPress={() => setToDate(null)}>
                                        <X size={16} color={theme.text.tertiary} />
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.generateBtn}
                            onPress={() => handleGenerate()}
                            disabled={isGenerating}
                        >
                            <LinearGradient
                                colors={[theme.palette.primary[500], theme.palette.primary[600]]}
                                style={styles.generateGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {isGenerating ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <>
                                        <FileCheck size={20} color="#FFF" />
                                        <Text style={styles.generateText}>Generate Clinical Protocol</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Success State */}
                <View style={[styles.readyPod, !reportResult && styles.disabledBtn]}>
                    <View style={styles.readyHeader}>
                        <CheckCircle size={24} color={theme.status.success} />
                        <Text style={styles.readyTitle}>Dossier Ready</Text>
                    </View>
                    <Text style={styles.readyDesc}>
                        The clinical dossier has been compiled and is ready for secure export.
                    </Text>
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.downloadBtn, !reportResult && styles.disabledBtn]}
                            onPress={downloadPdf}
                            disabled={!reportResult}
                        >
                            <Download size={18} color="#FFF" />
                            <Text style={styles.actionBtnText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.shareBtn, !reportResult && styles.disabledBtn]}
                            onPress={sharePdf}
                            disabled={!reportResult}
                        >
                            <Share2 size={18} color={theme.text.primary} />
                            <Text style={[styles.actionBtnText, { color: theme.text.primary }]}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Guidelines */}
                <View style={styles.infoPod}>
                    <View style={styles.infoItem}>
                        <Info size={16} color={theme.palette.primary[400]} />
                        <Text style={styles.infoText}>Encrypted clinical grade transmission.</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Info size={16} color={theme.palette.primary[400]} />
                        <Text style={styles.infoText}>Compliant with medical data standards.</Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </Animated.ScrollView>

            {/* Platform Modals */}
            {showFromPicker && (
                <DateTimePicker
                    value={fromDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={(e, d) => handleDateChange(e, d, 'from')}
                />
            )}
            {showToPicker && (
                <DateTimePicker
                    value={toDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={(e, d) => handleDateChange(e, d, 'to')}
                />
            )}
        </View>
    );
}
