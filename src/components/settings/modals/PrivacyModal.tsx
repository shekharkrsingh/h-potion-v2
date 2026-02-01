import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Shield, Zap, Check } from 'lucide-react-native';
import { BaseEditModal } from '@/components/profile/edit/modals/BaseEditModal';
import { Text } from '@/components/ui/Text';
import { RadioOption } from '@/components/settings/RadioOption';
import { ToggleRow } from '@/components/settings/ToggleRow';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

interface PrivacyModalProps {
    visible: boolean;
    onClose: () => void;
    theme: ColorTheme;
}

export const PrivacyModal = React.memo(({ visible, onClose, theme }: PrivacyModalProps) => {
    const [privacy, setPrivacy] = useState({
        visibility: 'public', // public, patients_only, private
        allowReviews: true,
        showOnline: true
    });

    return (
        <BaseEditModal visible={visible} title="Privacy" onClose={onClose}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
                <View style={{ alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.m }}>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: `${theme.palette.primary[500]}10`,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: spacing.m
                    }}>
                        <Shield size={28} color={theme.palette.primary[500]} />
                    </View>
                    <Text variant="h3" weight="bold">Profile Visibility</Text>
                </View>

                <View style={{ gap: spacing.m }}>
                    <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ textTransform: 'uppercase', marginBottom: 4 }}>Who can see your profile?</Text>

                    <RadioOption
                        label="Public Reach"
                        description="Anyone can find your profile and request appointments."
                        selected={privacy.visibility === 'public'}
                        onSelect={() => setPrivacy(p => ({ ...p, visibility: 'public' }))}
                        theme={theme}
                    />
                    <RadioOption
                        label="Patient-Only"
                        description="Only registered and verified patients can see your full details."
                        selected={privacy.visibility === 'patients_only'}
                        onSelect={() => setPrivacy(p => ({ ...p, visibility: 'patients_only' }))}
                        theme={theme}
                    />
                    <RadioOption
                        label="Private Mode"
                        description="Profile is hidden. Access is only through direct referral links."
                        selected={privacy.visibility === 'private'}
                        onSelect={() => setPrivacy(p => ({ ...p, visibility: 'private' }))}
                        theme={theme}
                    />

                    <View style={{
                        height: 1,
                        backgroundColor: theme.border.subtle,
                        marginVertical: spacing.l
                    }} />

                    <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ textTransform: 'uppercase', marginBottom: 4 }}>Interactions</Text>

                    <ToggleRow
                        icon={Zap}
                        color={theme.palette.primary[500]}
                        label="Online Visibility"
                        description="Show status when you are active"
                        value={privacy.showOnline}
                        onValueChange={v => setPrivacy(p => ({ ...p, showOnline: v }))}
                        theme={theme}
                    />
                    <ToggleRow
                        icon={Check}
                        color={theme.palette.primary[400]}
                        label="Patient Reviews"
                        description="Allow patients to post feedback"
                        value={privacy.allowReviews}
                        onValueChange={v => setPrivacy(p => ({ ...p, allowReviews: v }))}
                        theme={theme}
                    />
                </View>
            </ScrollView>
        </BaseEditModal>
    );
});
