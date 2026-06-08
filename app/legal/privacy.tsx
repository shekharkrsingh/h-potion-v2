import React, { useRef, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    const handleBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    }, [router]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background.default, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Text variant="h3" style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
                <Text variant="caption" color={theme.text.tertiary} style={{ marginBottom: 16 }}>Last Updated: June 8, 2026</Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>1. Scope and Roles</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    This Privacy Policy details how H-Potion ("we," "our," or "us") collects, uses, protects, and discloses information in connection with our Services. 
                    {"\n\n"}
                    In the context of patient data and Protected Health Information (PHI), H-Potion acts strictly as a **Data Processor** (or Business Associate under HIPAA) on behalf of the registered healthcare provider/practice (the "Data Controller"). The healthcare provider is solely responsible for establishing the legal basis for processing patient data, securing patient consent, and providing all required notices.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>2. Information We Collect</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    We collect the following categories of information:
                    {"\n\n"}
                    • **Account Information**: Name, email address, phone number, credentials, professional details, and licensing details (e.g., license number, authority, expiry date).
                    {"\n"}
                    • **Clinical Coordination Data**: Appointment schedules, check-in timestamps, payment status flags, and related practice management logs.
                    {"\n"}
                    • **Device & Usage Data**: IP address, device type, operating system version, app crash logs, performance metrics, and application navigation patterns.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>3. Use of Collected Information</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    We use collected information to:
                    {"\n\n"}
                    • Provide, operate, and maintain the H-Potion platform.
                    {"\n"}
                    • Verify professional credentials and secure user authentication.
                    {"\n"}
                    • Improve service speed, troubleshoot code errors, and optimize UX.
                    {"\n"}
                    • Send essential system notifications, security alerts, and license expiry warnings.
                    {"\n\n"}
                    **Aggregated and De-identified Data**: H-Potion may anonymize, aggregate, and de-identify any user or usage data. H-Potion retains full ownership rights to such aggregated data and may use it for any commercial or non-commercial purpose, including analytics, system training, and business reporting.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>4. Healthcare Data Privacy (HIPAA Compliance)</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    To the extent that H-Potion has access to Protected Health Information (PHI) or confidential patient records, we protect and maintain such data in strict accordance with the Business Associate Agreement (BAA) executed between H-Potion and the healthcare provider. 
                    {"\n\n"}
                    Healthcare providers agree not to upload any patient data to the platform unless they have acquired all necessary consents, authorization, and HIPAA-compliant releases from the patient.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>5. Data Security and Limitations</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    We implement industry-standard technical, administrative, and physical security controls to safeguard your data. However, no database, internet connection, or mobile application is entirely secure. 
                    {"\n\n"}
                    We cannot guarantee absolute security against unauthorized access, hacking, data loss, or breaches. To the maximum extent permitted by law, H-Potion disclaims liability for any damages or breaches resulting from security incidents, unless caused by our gross negligence or willful misconduct.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>6. Cookies and Tracking Technologies</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    Our Services utilize cookies, web beacons, local storage tokens, and mobile software development kits (SDKs) to:
                    {"\n\n"}
                    • **Maintain Sessions**: Keep you logged in securely and remember authentication states.
                    {"\n"}
                    • **Optimize Performance**: Cache screen resources and configurations to load details faster.
                    {"\n"}
                    • **Diagnostics**: Track crashes, response times, and API success rates to optimize platform stability.
                    {"\n\n"}
                    By continuing to access or use H-Potion, you consent to the storage and use of these tracking mechanisms on your device. You may modify device settings to block cookies/local tokens, though doing so may disable core components of the Services.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>7. Third-Party Links and Services</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 24, lineHeight: 22 }}>
                    Our Services may contain links to external sites or integrate with third-party tools. We do not control and are not responsible for the privacy practices, policies, or content of any third-party websites or services.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
    },
    headerTitle: { flex: 1, textAlign: 'center' },
    backButton: { padding: 8 },
    scrollContent: { padding: 24, paddingBottom: 60 }
});
