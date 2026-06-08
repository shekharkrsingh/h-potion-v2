import React, { useRef, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<any>(null);

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
                <Text variant="h3" style={styles.headerTitle}>Terms of Service</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
                <Text variant="caption" color={theme.text.tertiary} style={{ marginBottom: 16 }}>Last Updated: June 8, 2026</Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>1. Agreement and Acceptance</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    Welcome to H-Potion. By downloading, registering, accessing, or using our mobile and web applications (collectively, the "Services"), you agree to be bound by these Terms of Service (the "Terms"). If you do not agree to these Terms, you must immediately cease all use of our Services.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>2. Software Platform Only (No Medical Services)</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    H-Potion is a software technology provider. We provide a digital platform for healthcare scheduling, coordination, and practice management. H-Potion is NOT a healthcare provider, does not practice medicine, and does not provide clinical care, professional medical advice, diagnosis, or treatment. 
                    {"\n\n"}
                    All clinical decisions, medical consultations, and care plans are made solely at the discretion and responsibility of the participating healthcare providers (the "Doctors"). H-Potion disclaims any and all liability arising from clinical services, medical malpractice, negligence, or diagnostic inaccuracies.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>3. Provider Credentials and Compliance</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    Doctors using the Services represent and warrant that they possess active, unrestricted, and valid medical licenses, certifications, and credentials required to practice medicine in their respective jurisdictions. 
                    {"\n\n"}
                    Doctors agree to supply accurate licensing details. Any update to professional profiles immediately reverts the account status to "PENDING" verification, during which booking privileges may be suspended. H-Potion reserves the right, but does not assume the obligation, to perform verification checks and suspend accounts failing to meet credentials criteria.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>4. Data Ownership and Rights</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    You retain your ownership rights in any information, profiles, or data you upload to the Services ("User Content"). You grant H-Potion a worldwide, perpetual, royalty-free, and fully sublicensable license to host, store, process, and transmit User Content to run and support the Services.
                    {"\n\n"}
                    H-Potion reserves the right to compile, analyze, use, and commercialize aggregated, anonymized, and de-identified data derived from your use of the Services for research, analytics, product development, and industry benchmarking. H-Potion retains full ownership of all aggregated and de-identified data.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>5. Limitation of Liability</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    To the maximum extent permitted by law, H-Potion and its affiliates, officers, directors, employees, and licensing partners shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages. This includes, but is not limited to, damages for loss of profits, loss of clinical data, goodwill, service interruptions, database exposure, or medical malpractice claims arising out of or related to your use of the Services.
                    {"\n\n"}
                    H-Potion's total cumulative liability for any claims arising under or in connection with these Terms shall not exceed the total amount paid by you to H-Potion in the twelve (12) months preceding the event giving rise to such liability.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>6. Indemnification</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    You agree to defend, indemnify, and hold harmless H-Potion and its officers, directors, employees, and agents from and against any third-party claims, lawsuits, administrative actions, liabilities, damages, and costs (including reasonable legal fees) arising out of or relating to: (a) your breach of these Terms, (b) your violation of any laws or regulations, or (c) any clinical malpractice, negligence, or professional services provided by you.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>7. Termination and Suspension</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 20, lineHeight: 22 }}>
                    H-Potion reserves the right, in its sole discretion, to suspend, terminate, or restrict your access to all or part of the Services at any time, with or without prior notice, for reasons including but not limited to: license expiration, verification failure, policy violations, regulatory requests, or non-payment of fees.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>8. Governing Law and Disputes</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 24, lineHeight: 22 }}>
                    These Terms shall be governed by, construed, and enforced in accordance with the laws of the jurisdiction in which H-Potion is registered, without regard to conflict of laws principles. Any legal suit, action, or proceeding arising out of or related to these Terms shall be instituted exclusively in courts located in said jurisdiction, or resolved through binding arbitration.
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
