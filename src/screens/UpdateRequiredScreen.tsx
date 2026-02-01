import React from 'react';
import { View, Image, ScrollView, Linking, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { createStyles } from '@/styles/screens/UpdateRequiredScreen.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { StatusBar } from 'expo-status-bar';

interface UpdateRequiredScreenProps {
    onDismiss?: () => void;
}

export const UpdateRequiredScreen: React.FC<UpdateRequiredScreenProps> = ({ onDismiss }) => {
    const { theme, isDark } = useTheme();
    const styles = createStyles(theme);
    const { runtimeConfig, updateStatus } = useSelector((state: RootState) => state.config);

    const isForceUpdate = updateStatus === 'force';

    const handleUpdate = () => {
        const url = Platform.OS === 'ios'
            ? runtimeConfig?.applePlayStoreUrl
            : runtimeConfig?.googlePlayStoreUrl;

        if (url) {
            Linking.openURL(url);
        }
    };

    const getMessage = () => {
        if (isForceUpdate) {
            return {
                title: "Critcal Update Required",
                subtitle: "Your current application version is no longer compatible with our clinical ecosystem security protocols.",
                instruction: "To maintain secure access to your medical records and professional tools, please update to the latest version via your platform's store. Access will be restored immediately after the update."
            };
        }
        return {
            title: "Performance Update",
            subtitle: "A new professional version of H-Potion is available with enhanced diagnostic speed and UI refinements.",
            instruction: "We recommend updating to the latest version to ensure you have access to all new clinical features and security patches."
        };
    };

    const messages = getMessage();

    return (
        <View style={styles.container}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <View style={styles.heroContainer}>
                <Image
                    source={require('@assets/hero_update.png')}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', theme.background.default]}
                    style={styles.gradientOverlay}
                />
            </View>

            <ScrollView
                style={styles.contentScroll}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={[
                    styles.statusBadge,
                    { backgroundColor: isForceUpdate ? theme.status.errorBg : theme.status.infoBg }
                ]}>
                    <Text
                        variant="caption"
                        weight="semiBold"
                        color={isForceUpdate ? "error" : "brand"}
                    >
                        {isForceUpdate ? "PROTOCOL ALERT" : "IMPROVEMENT AVAILABLE"}
                    </Text>
                </View>

                <Text style={styles.title}>{messages.title}</Text>
                <Text style={styles.subtitle}>{messages.subtitle}</Text>

                <View style={styles.instructionCard}>
                    <Text style={styles.instructionTitle}>Professional Instructions</Text>
                    <Text style={styles.instructionText}>{messages.instruction}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Update Access Now"
                        onPress={handleUpdate}
                        variant="primary"
                        style={styles.primaryButton}
                    />

                    {!isForceUpdate && onDismiss && (
                        <Button
                            title="Not Now, Continue"
                            onPress={onDismiss}
                            variant="secondary"
                            style={styles.secondaryButton}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};
