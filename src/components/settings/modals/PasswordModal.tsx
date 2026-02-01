import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { Lock, Eye, EyeOff } from 'lucide-react-native';
import { BaseEditModal } from '@/components/profile/edit/modals/BaseEditModal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { haptics } from '@/utils/haptics';
import { AuthService } from '@/services/auth/authService';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

import { useToast } from '@/context/ToastContext';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface PasswordModalProps {
    visible: boolean;
    onClose: () => void;
    theme: ColorTheme;
}

export const PasswordModal = React.memo(({ visible, onClose, theme }: PasswordModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ old: '', new: '', confirmMatch: '' });
    const { showToast } = useToast();

    // Visibility States
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUpdate = async () => {
        if (!form.old || !form.new || form.new !== form.confirmMatch) {
            showToast("Passwords must match and not be empty", "error");
            return;
        }

        setIsLoading(true);
        try {
            await AuthService.changePassword(form.old, form.new);
            haptics.impact();
            showToast("Password updated successfully", "success");
            setForm({ old: '', new: '', confirmMatch: '' });
            onClose();
        } catch (e: any) {
            showToast(e.message || "Failed to update password", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BaseEditModal visible={visible} title="Security" onClose={onClose}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
                <View style={{ alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.m }}>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: `${theme.status.error}10`,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: spacing.m
                    }}>
                        <Lock size={28} color={theme.status.error} />
                    </View>
                    <Text variant="h3" weight="bold">Update Password</Text>
                    <Text variant="caption" color={theme.text.tertiary} style={{ textAlign: 'center', marginTop: 4, paddingHorizontal: 20 }}>
                        Change your security credentials to keep your medical account safe.
                    </Text>
                </View>

                <View style={{ gap: spacing.m }}>
                    <Input
                        label="Current Password"
                        placeholder="••••••••"
                        secureTextEntry={!showOld}
                        value={form.old}
                        onChangeText={t => setForm(p => ({ ...p, old: t }))}
                        rightIcon={showOld ? <EyeOff size={18} color={theme.text.tertiary} /> : <Eye size={18} color={theme.text.tertiary} />}
                        onRightIconPress={() => { haptics.selection(); setShowOld(!showOld); }}
                    />
                    <View>
                        <Input
                            label="New Password"
                            placeholder="Minimum 8 characters"
                            secureTextEntry={!showNew}
                            value={form.new}
                            onChangeText={t => setForm(p => ({ ...p, new: t }))}
                            rightIcon={showNew ? <EyeOff size={18} color={theme.text.tertiary} /> : <Eye size={18} color={theme.text.tertiary} />}
                            onRightIconPress={() => { haptics.selection(); setShowNew(!showNew); }}
                        />
                        <VerificationBadge visible={form.new.length >= 8} style={{ top: 42, right: 46 }} />
                    </View>

                    <View>
                        <Input
                            label="Confirm New Password"
                            placeholder="••••••••"
                            secureTextEntry={!showConfirm}
                            value={form.confirmMatch}
                            onChangeText={t => setForm(p => ({ ...p, confirmMatch: t }))}
                            rightIcon={showConfirm ? <EyeOff size={18} color={theme.text.tertiary} /> : <Eye size={18} color={theme.text.tertiary} />}
                            onRightIconPress={() => { haptics.selection(); setShowConfirm(!showConfirm); }}
                        />
                        <VerificationBadge visible={form.confirmMatch === form.new && form.confirmMatch.length >= 8} style={{ top: 42, right: 46 }} />
                    </View>

                    <Button
                        title="Update Credentials"
                        isLoading={isLoading}
                        onPress={handleUpdate}
                        style={{ marginTop: spacing.m }}
                    />
                </View>
            </ScrollView>
        </BaseEditModal>
    );
});
