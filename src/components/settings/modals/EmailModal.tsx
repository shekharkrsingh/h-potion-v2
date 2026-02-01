import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { Mail, Check } from 'lucide-react-native';
import { BaseEditModal } from '@/components/profile/edit/modals/BaseEditModal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { haptics } from '@/utils/haptics';
import { AuthService } from '@/services/auth/authService';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

import { useToast } from '@/context/ToastContext';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface EmailModalProps {
    visible: boolean;
    onClose: () => void;
    currentEmail: string;
    theme: ColorTheme;
}

export const EmailModal = React.memo(({ visible, onClose, currentEmail, theme }: EmailModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'otp'>('input');
    const [form, setForm] = useState({ newEmail: '', otp: '', confirmPassword: '' });
    const { showToast } = useToast();

    // Reset state when modal opens/closes
    React.useEffect(() => {
        if (!visible) {
            setStep('input');
            setForm({ newEmail: '', otp: '', confirmPassword: '' });
        }
    }, [visible]);

    const handleSendCode = async () => {
        if (!form.newEmail) {
            showToast("Please enter a new email address", "error");
            return;
        }
        if (form.newEmail === currentEmail) {
            showToast("New email must be different", "error");
            return;
        }

        setIsLoading(true);
        try {
            await AuthService.resendOtp(form.newEmail);
            haptics.impact();
            setStep('otp');
            showToast(`Verification code sent to ${form.newEmail}`, "info");
        } catch (e: any) {
            showToast(e.message || "Failed to send verification code", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!form.otp || !form.confirmPassword) {
            showToast("Please enter verification code and password", "error");
            return;
        }

        setIsLoading(true);
        try {
            await AuthService.updateEmail(form.newEmail, form.otp, form.confirmPassword);
            haptics.impact();
            showToast("Email address updated successfully", "success");
            onClose();
        } catch (e: any) {
            showToast(e.message || "Update Failed", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseEditModal visible={visible} title={step === 'input' ? "Update Email" : "Verify Email"} onClose={onClose}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
                <View style={{ alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.m }}>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: `${theme.palette.secondary[400]}10`,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: spacing.m
                    }}>
                        <Mail size={28} color={theme.palette.secondary[400]} />
                    </View>
                    <Text variant="h3" weight="bold">{step === 'input' ? "New Address" : "Verification"}</Text>
                    {step === 'otp' && (
                        <Text variant="caption" color={theme.text.tertiary} style={{ textAlign: 'center', marginTop: 4 }}>
                            Enter the code sent to {form.newEmail}
                        </Text>
                    )}
                </View>

                {step === 'input' ? (
                    <View style={{ gap: spacing.l }}>
                        {/* Current Email Status Card */}
                        <View style={{
                            padding: spacing.l,
                            borderRadius: radius.l,
                            backgroundColor: theme.background.subtle,
                            borderWidth: 1,
                            borderColor: theme.border.subtle
                        }}>
                            <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ textTransform: 'uppercase' }}>Current verified address</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                                <Text variant="bodyLarge" weight="bold" color={theme.text.primary}>{currentEmail || 'N/A'}</Text>
                                <View style={{ marginLeft: 8, backgroundColor: `${theme.palette.primary[500]}15`, padding: 4, borderRadius: 20 }}>
                                    <Check size={14} color={theme.palette.primary[500]} />
                                </View>
                            </View>
                        </View>

                        <View>
                            <Input
                                label="New Email Address"
                                placeholder="new.email@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={form.newEmail}
                                onChangeText={t => setForm(p => ({ ...p, newEmail: t }))}
                            />
                            <VerificationBadge visible={/\S+@\S+\.\S+/.test(form.newEmail)} style={{ top: 42 }} />
                        </View>

                        <Button
                            title="Send Verification Code"
                            isLoading={isLoading}
                            onPress={handleSendCode}
                            style={{ marginTop: spacing.m }}
                        />
                    </View>
                ) : (
                    <View style={{ gap: spacing.m }}>
                        <Input
                            label="Verification Code (OTP)"
                            placeholder="123456"
                            keyboardType="number-pad"
                            value={form.otp}
                            onChangeText={t => setForm(p => ({ ...p, otp: t }))}
                        />
                        <Input
                            label="Confirm Password"
                            placeholder="Enter your current password"
                            secureTextEntry
                            value={form.confirmPassword}
                            onChangeText={t => setForm(p => ({ ...p, confirmPassword: t }))}
                        />

                        <Button
                            title="Verify & Update"
                            isLoading={isLoading}
                            onPress={handleUpdate}
                            style={{ marginTop: spacing.m }}
                        />

                        <Button
                            title="Cancel"
                            variant="outline"
                            onPress={() => setStep('input')}
                            disabled={isLoading}
                        />
                    </View>
                )}
            </ScrollView>
        </BaseEditModal>
    );
});
