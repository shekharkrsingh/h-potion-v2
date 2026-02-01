import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '@/store';
import { updateSignupData, sendOtp } from '@/store/slices/authSlice';
import { AuthStepLayout } from '@/components/shared/AuthStepLayout';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { useTheme } from '@/theme/ThemeContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { useToast } from '@/context/ToastContext';
import { createStyles } from '@/styles/auth/signup-credentials.styles';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

export default function SignupCredentialsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const signupData = useSelector((state: RootState) => state.auth.signupData);

    const [email, setEmail] = useState(signupData.email || '');
    const [password, setPassword] = useState(signupData.password || '');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!email || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
        if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 chars';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!agreedToTerms) newErrors.terms = 'You must agree to the terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (validate()) {
            setIsLoading(true);
            try {
                // Save data to store
                dispatch(updateSignupData({ email, password }));

                // Send OTP
                await dispatch(sendOtp(email)).unwrap();

                showToast('OTP sent! Please check your email.', 'success');
                router.push('/(auth)/signup/verify');
            } catch (error: any) {
                showToast(error || 'Failed to send OTP', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <AuthStepLayout
            title="Secure Credentials"
            subtitle="Establish your professional access parameters and security protocols."
            primaryButtonTitle="Next: Identity Verification"
            onPrimaryPress={handleNext}
            onBack={() => router.back()}
            onHelp={() => Alert.alert('Help', 'Need assistance? Contact support@hpotion.com')}
            isLoading={isLoading}
            logo={<AuthLogo />}
            footer={<AuthFooter mode="signup" />}
            socialLogins={<SocialLoginButtons />}
        >
            <View style={styles.container}>
                <View>
                    <Input
                        label="Email"
                        placeholder="doctor@hospital.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                        leftIcon={<Mail size={20} color={theme.text.tertiary} />}
                    />
                    <VerificationBadge visible={/\S+@\S+\.\S+/.test(email) && !errors.email} style={{ top: 42 }} />
                </View>

                <View>
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        error={errors.password}
                        leftIcon={<Lock size={20} color={theme.text.tertiary} />}
                        rightIcon={showPassword ? <EyeOff size={20} color={theme.text.tertiary} /> : <Eye size={20} color={theme.text.tertiary} />}
                        onRightIconPress={() => setShowPassword(!showPassword)}
                    />
                    <VerificationBadge visible={password.length >= 6 && !errors.password} style={{ top: 42, right: 46 }} />
                </View>

                <View>
                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        error={errors.confirmPassword}
                        leftIcon={<Lock size={20} color={theme.text.tertiary} />}
                        rightIcon={showConfirmPassword ? <EyeOff size={20} color={theme.text.tertiary} /> : <Eye size={20} color={theme.text.tertiary} />}
                        onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                    <VerificationBadge visible={confirmPassword === password && confirmPassword.length >= 6 && !errors.confirmPassword} style={{ top: 42, right: 46 }} />
                </View>
                <Checkbox
                    label="I agree to the Terms and Conditions and Privacy Policy"
                    checked={agreedToTerms}
                    onChange={setAgreedToTerms}
                    error={errors.terms}
                />
            </View>
        </AuthStepLayout>
    );
}
