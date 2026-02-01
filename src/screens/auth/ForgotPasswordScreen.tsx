import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { sendOtp, setRecoveryStep, resetRecovery, setRecoveryEmail, resetPassword } from '@/store/slices/authSlice';
import { AuthStepLayout } from '@/components/shared/AuthStepLayout';
import { Input } from '@/components/ui/Input';
import { Text as ThemedText } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { AuthLogo } from '@/components/auth/AuthLogo';
import { createStyles } from '@/styles/auth/forgot-password.styles';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { showToast } = useToast();
    const dispatch = useDispatch<AppDispatch>();

    const { recoveryStep, recoveryEmail, isLoading, error, recoverySuccess } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [resendTimer, setResendTimer] = useState(30);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0 && recoveryStep === 2) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer, recoveryStep]);

    useEffect(() => {
        return () => {
            dispatch(resetRecovery());
        };
    }, [dispatch]);

    useEffect(() => {
        if (recoverySuccess && recoveryStep === 3) {
            showToast('Password Reset Successful! You can now login.', 'success');
            router.replace('/(auth)/login');
        }
    }, [recoverySuccess, recoveryStep, router]);

    const handleSendLink = async () => {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setLocalError('Please enter a valid email address');
            return;
        }
        setLocalError('');

        try {
            await dispatch(sendOtp(email)).unwrap();
            dispatch(setRecoveryEmail(email));
            dispatch(setRecoveryStep(2));
        } catch (err: any) {
            setLocalError(err || 'Failed to send OTP');
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResendTimer(30);
        try {
            await dispatch(sendOtp(recoveryEmail || email)).unwrap();
            showToast('A new verification code has been sent to your email.', 'success');
        } catch (err: any) {
            setLocalError(err || 'Failed to resend OTP');
        }
    };

    const handleResetPassword = async () => {
        if (!otp || otp.length !== 6) {
            setLocalError('Please enter a valid 6-digit OTP');
            showToast('Please enter a valid 6-digit OTP', 'warning');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }
        setLocalError('');

        // Password reset logic integration
        try {
            await dispatch(resetPassword({ email: recoveryEmail || email, newPassword, otp })).unwrap();
        } catch (err: any) {
            setLocalError(err || 'Password reset failed');
        }
    };

    const isStep1 = recoveryStep === 1;

    return (
        <AuthStepLayout
            title={isStep1 ? "Forgot Password?" : "Reset Password"}
            subtitle={isStep1
                ? "Don't worry! It happens. Please enter the email associated with your account."
                : `Enter the code sent to ${recoveryEmail || email} and your new password.`}
            primaryButtonTitle={isStep1 ? "Send Validation Code" : "Reset Password"}
            onPrimaryPress={isStep1 ? handleSendLink : handleResetPassword}
            onBack={isStep1 ? () => router.back() : () => dispatch(setRecoveryStep(1))}
            isLoading={isLoading}
            onHelp={() => showToast('Need assistance? Contact support@hpotion.com', 'info')}
            logo={<AuthLogo />}
            footer={isStep1 ? <AuthFooter mode="signup" /> : (
                <View style={styles.footer}>
                    <ThemedText variant="bodySmall" color={theme.text.secondary}>
                        Didn't receive the code?
                    </ThemedText>
                    <TouchableOpacity
                        onPress={handleResend}
                        style={styles.resendButton}
                        disabled={resendTimer > 0}
                    >
                        <ThemedText
                            variant="bodySmall"
                            color={resendTimer > 0 ? theme.text.tertiary : theme.text.brand}
                            weight="bold"
                        >
                            {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            )}
        >
            {isStep1 ? (
                <Input
                    label="Email Address"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (localError) setLocalError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={localError || (error as string)}
                    leftIcon={<Mail size={20} color={theme.text.tertiary} />}
                />
            ) : (
                <View style={styles.container}>
                    <Input
                        label="Verification Code"
                        placeholder="123456"
                        value={otp}
                        onChangeText={(text) => {
                            // Only allow numbers and limit to 6 chars
                            if (/^\d*$/.test(text) && text.length <= 6) {
                                setOtp(text);
                            }
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        error={!otp && localError ? localError : undefined}
                        leftIcon={<Lock size={20} color={theme.text.tertiary} />}
                    />
                    <Input
                        label="New Password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showPassword}
                        error={localError || (error as string)}
                        leftIcon={<Lock size={20} color={theme.text.tertiary} />}
                        rightIcon={showPassword ? <EyeOff size={20} color={theme.text.tertiary} /> : <Eye size={20} color={theme.text.tertiary} />}
                        onRightIconPress={() => setShowPassword(!showPassword)}
                    />
                </View>
            )}
        </AuthStepLayout>
    );
}
