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
                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>1. Introduction</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 24, lineHeight: 22 }}>
                    Welcome to H-Potion. By using our application, you agree to these terms. Please read them carefully. Our service provides a digital platform for healthcare management and appointments.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>2. Use of Service</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 24, lineHeight: 22 }}>
                    You must follow any policies made available to you within the Services. You may use our Services only as permitted by law, including applicable export and re-export control laws and regulations.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>3. Privacy Protection</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 24, lineHeight: 22 }}>
                    H-Potion’s privacy policies explain how we treat your personal data and protect your privacy when you use our Services. By using our Services, you agree that H-Potion can use such data in accordance with our privacy policies.
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
