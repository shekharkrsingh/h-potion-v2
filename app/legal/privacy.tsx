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
                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>Information We Collect</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 24, lineHeight: 22 }}>
                    We collect information to provide better services to all our users — from figuring out basic stuff like which language you speak, to more complex things like which healthcare providers you visit most.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>How We Use Information</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 24, lineHeight: 22 }}>
                    We use the information we collect from all our services to provide, maintain, protect and improve them, to develop new ones, and to protect H-Potion and our users.
                </Text>

                <Text variant="h4" color={theme.text.primary} style={{ marginBottom: 12 }}>Information We Share</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={{ marginBottom: 24, lineHeight: 22 }}>
                    We do not share personal information with companies, organizations and individuals outside of H-Potion unless one of the following circumstances applies: With your consent, for external processing, or for legal reasons.
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
