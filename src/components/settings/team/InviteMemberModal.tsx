import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Shield, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseEditModal } from '@/components/profile/edit/modals/BaseEditModal';
import { Input } from '@/components/ui/Input';
import { ColorTheme } from '@/theme/colors';

interface InviteMemberModalProps {
    visible: boolean;
    onClose: () => void;
    onInvite: (email: string, role: string) => Promise<void>;
    theme: ColorTheme;
}

export const InviteMemberModal = React.memo(({ visible, onClose, onInvite, theme }: InviteMemberModalProps) => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole] = useState('COLLABORATOR');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSend = async () => {
        setIsSubmitting(true);
        try {
            await onInvite(inviteEmail, inviteRole);
            setInviteEmail('');
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseEditModal
            visible={visible}
            title="Invite Member"
            onClose={onClose}
        >
            <View style={{ padding: 20 }}>
                <View style={{
                    flexDirection: 'row',
                    marginBottom: 24,
                    padding: 12,
                    backgroundColor: theme.background.subtle,
                    borderRadius: 12
                }}>
                    <Shield size={24} color={theme.palette.primary[500]} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4, color: theme.text.primary }}>Role Access</Text>
                        <Text style={{ fontSize: 12, color: theme.text.secondary }}>
                            Collaborators can manage appointments but cannot change your clinic settings.
                        </Text>
                    </View>
                </View>

                <Input
                    label="Email Address"
                    value={inviteEmail}
                    onChangeText={setInviteEmail}
                    placeholder="colleague@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon={<Mail size={20} color={theme.text.tertiary} />}
                />

                <TouchableOpacity
                    style={{
                        marginTop: 24,
                        shadowColor: theme.palette.primary[500],
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 4
                    }}
                    onPress={handleSend}
                    disabled={inviteEmail.length <= 5 || isSubmitting}
                >
                    <LinearGradient
                        colors={[theme.palette.primary[500], theme.palette.primary[600]]}
                        style={{
                            paddingVertical: 16,
                            borderRadius: 16,
                            alignItems: 'center',
                            opacity: (inviteEmail.length > 5 && !isSubmitting) ? 1 : 0.7
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: 16 }}>
                            {isSubmitting ? 'Sending...' : 'Send Invitation'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </BaseEditModal>
    );
});
