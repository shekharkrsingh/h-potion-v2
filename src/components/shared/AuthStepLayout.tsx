import React from 'react';
import { View, ImageBackground, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { MoveLeft, HelpCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyles } from '@/styles/components/shared/AuthStepLayout.styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StatusBar } from 'expo-status-bar';

interface AuthStepLayoutProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onBack?: () => void;
    primaryButtonTitle: string;
    onPrimaryPress: () => void;
    isLoading?: boolean;
    primaryButtonDisabled?: boolean;
    secondaryButtonTitle?: string;
    onSecondaryPress?: () => void;
    footer?: React.ReactNode;
    socialLogins?: React.ReactNode;
    logo?: React.ReactNode;
    onHelp?: () => void;
}

export const AuthStepLayout: React.FC<AuthStepLayoutProps> = ({
    title,
    subtitle,
    children,
    onBack,
    primaryButtonTitle,
    onPrimaryPress,
    isLoading = false,
    primaryButtonDisabled = false,
    secondaryButtonTitle,
    onSecondaryPress,
    footer,
    socialLogins,
    logo,
    onHelp,
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const styles = createStyles(theme);

    const topInset = insets.top + (Platform.OS === 'android' ? 10 : 0);

    return (
        <View style={styles.container}>
            <StatusBar style="light" translucent backgroundColor="transparent" />

            <ImageBackground
                source={require('@assets/heroauth.jpg')}
                style={styles.heroImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={theme.mode === 'dark'
                        ? ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.4)', 'rgba(15, 23, 42, 1)']
                        : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 1)']}
                    locations={[0, 0.6, 1]}
                    style={styles.heroOverlay}
                />

                {onBack && (
                    <Button
                        title="Back"
                        variant="ghost"
                        size="sm"
                        onPress={onBack}
                        leftIcon={<MoveLeft size={20} color="#fff" />}
                        style={[styles.backButton, { top: topInset }]}
                        textColor="#fff"
                    />
                )}

                {onHelp && (
                    <Button
                        title="Help"
                        variant="ghost"
                        size="sm"
                        onPress={onHelp}
                        rightIcon={<HelpCircle size={20} color="#fff" />}
                        style={[styles.helpButton, { top: topInset }]}
                        textColor="#fff"
                    />
                )}

                <View style={[styles.headerOverlay, { paddingTop: insets.top + 40, paddingBottom: 80 }]}>
                    {logo && <View style={styles.logoContainer}>{logo}</View>}
                    <Text variant="h1" align="center" style={styles.title} color="#fff">
                        {title}
                    </Text>
                    {subtitle && (
                        <Text variant="bodyMedium" align="center" style={styles.subtitle} color="rgba(255,255,255,0.9)">
                            {subtitle}
                        </Text>
                    )}
                </View>
            </ImageBackground>

            <View style={[styles.sheetContainer, { backgroundColor: theme.background.default }]}>
                <KeyboardAwareScrollView
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    enableAutomaticScroll={true}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.content}>
                        {children}
                    </View>

                    <View style={styles.actions}>
                        <Button
                            title={primaryButtonTitle}
                            onPress={onPrimaryPress}
                            isLoading={isLoading}
                            disabled={primaryButtonDisabled}
                            fullWidth
                            size="lg"
                        />

                        {secondaryButtonTitle && onSecondaryPress && (
                            <Button
                                title={secondaryButtonTitle}
                                onPress={onSecondaryPress}
                                variant="ghost"
                                fullWidth
                                style={styles.secondaryButton}
                            />
                        )}
                    </View>

                    {socialLogins && (
                        <View style={styles.socialSection}>
                            {socialLogins}
                        </View>
                    )}

                    {footer && <View style={styles.footer}>{footer}</View>}
                </KeyboardAwareScrollView>
            </View>
        </View>
    );
};


