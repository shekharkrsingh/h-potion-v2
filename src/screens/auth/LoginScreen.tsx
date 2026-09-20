import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { AuthStepLayout } from '@/components/shared/AuthStepLayout';
import { createStyles } from '@/styles/auth/login.styles';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

import { useToast } from '@/context/ToastContext';

export default function LoginScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { showToast } = useToast();
    const {
        email, setEmail,
        password, setPassword,
        emailError, passwordError,
        isLoading,
        handleLogin: originalHandleLogin
    } = useAuth();
    const styles = createStyles(theme);

    const [showPassword, setShowPassword] = React.useState(false);

    const handleLoginWrapper = async () => {
        try {
            await originalHandleLogin();
            showToast('Welcome back!', 'success');
        } catch (error: any) {
            showToast(error || 'Login failed', 'error');
        }
    };

    return (
        <AuthStepLayout
            title="Professional Access"
            subtitle="Securely manage clinical records, patient profiles, and medical appointments."
            primaryButtonTitle="Secure Sign In"
            onPrimaryPress={handleLoginWrapper}
            isLoading={isLoading}
            primaryButtonDisabled={!/\S+@\S+\.\S+/.test(email) || password.length === 0}
            footer={<AuthFooter mode="login" />}
            /* socialLogins={<SocialLoginButtons />} [TEMP DISABLED] */
            logo={<AuthLogo />}
            onHelp={() => showToast('For technical assistance, please contact clinical support.', 'info')}
        >

            <View style={styles.form}>
                <View>
                    <Input
                        label="Email Address"
                        placeholder="doctor@hospital.com"
                        value={email}
                        onChangeText={setEmail}
                        error={emailError}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        leftIcon={<Mail size={20} color={theme.text.tertiary} />}
                    />
                    <VerificationBadge visible={/\S+@\S+\.\S+/.test(email)} style={{ top: 42 }} />
                </View>

                <View>
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        error={passwordError}
                        secureTextEntry={!showPassword}
                        leftIcon={<Lock size={20} color={theme.text.tertiary} />}
                        rightIcon={showPassword ? <EyeOff size={20} color={theme.text.tertiary} /> : <Eye size={20} color={theme.text.tertiary} />}
                        onRightIconPress={() => setShowPassword(!showPassword)}
                    />
                    {/* Only show badge if length > 5 AND no error */}
                    <VerificationBadge visible={password.length > 5 && !passwordError} style={{ top: 42, right: 46 }} />
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/(auth)/forgot-password')}
                    style={styles.forgotPassword}
                >
                    <Text variant="caption" color={theme.text.brand} weight="semiBold">
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
            </View>
        </AuthStepLayout>
    );
}


