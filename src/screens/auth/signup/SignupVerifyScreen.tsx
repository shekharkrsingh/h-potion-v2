import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '@/store';
import { registerUser, sendOtp } from '@/store/slices/authSlice';
import { AuthStepLayout } from '@/components/shared/AuthStepLayout';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { Lock } from 'lucide-react-native';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { createStyles } from '@/styles/auth/verify.styles';
import { useToast } from '@/context/ToastContext';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

export default function SignupVerifyScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const signupData = useSelector((state: RootState) => state.auth.signupData);
    const dispatch = useDispatch<AppDispatch>();
    const { showToast } = useToast();

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            showToast('Please enter a valid 6-digit OTP', 'warning');
            return;
        }

        setIsLoading(true);

        try {
            // Register with all data + OTP
            await dispatch(registerUser({
                firstName: signupData.firstName || '',
                lastName: signupData.lastName || '',
                email: signupData.email || '',
                password: signupData.password,
                otp
            })).unwrap();

            showToast('Account created successfully!', 'success');
            router.replace('/(tabs)');
        } catch (err: any) {
            showToast(err || 'Verification failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        try {
            await dispatch(sendOtp(signupData.email || '')).unwrap();
            setResendTimer(30);
            showToast('A new verification code has been sent to your email.', 'success');
        } catch (err: any) {
            showToast(err || 'Failed to resend code', 'error');
        }
    };

    return (
        <AuthStepLayout
            title="Identity Verification"
            subtitle={`Please enter the code sent to ${signupData.email || 'your medical email'} for security clearance.`}
            primaryButtonTitle="Verify and Activate Account"
            onPrimaryPress={handleVerify}
            onBack={() => router.back()}
            isLoading={isLoading}
            primaryButtonDisabled={otp.length !== 6}
            onHelp={() => showToast('Need assistance? Contact support@hpotion.com', 'info')}
            logo={<AuthLogo />}
            footer={
                <View style={styles.footer}>
                    <Text variant="bodySmall" color={theme.text.secondary}>
                        Didn't receive the code?
                    </Text>
                    <TouchableOpacity
                        onPress={handleResend}
                        style={styles.resendButton}
                        disabled={resendTimer > 0}
                    >
                        <Text
                            variant="bodySmall"
                            color={resendTimer > 0 ? theme.text.tertiary : theme.text.brand}
                            weight="bold"
                        >
                            {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        >
            <View>
                <Input
                    label="Verification Code"
                    placeholder="123456"
                    value={otp}
                    onChangeText={(text) => {
                        if (/^\d*$/.test(text) && text.length <= 6) {
                            setOtp(text);
                        }
                    }}
                    keyboardType="number-pad"
                    leftIcon={<Lock size={20} color={theme.text.tertiary} />}
                    style={styles.otpInput}
                    maxLength={6}
                />
                <VerificationBadge visible={otp.length === 6} style={{ top: 42 }} />
            </View>
        </AuthStepLayout>
    );
}
