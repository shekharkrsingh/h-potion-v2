import React, { useState, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Animated, Easing, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    Headphones, MessageSquare, Zap, CreditCard,
    User, MoreHorizontal, CheckCircle2, ChevronRight
} from 'lucide-react-native';
import { BaseEditModal } from '@/components/profile/edit/modals/BaseEditModal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { haptics } from '@/utils/haptics';
import { SupportService } from '@/services/supportService';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface SupportModalProps {
    visible: boolean;
    onClose: () => void;
    theme: ColorTheme;
}

const SuccessView = ({ theme, onClose }: { theme: ColorTheme; onClose: () => void }) => {
    const scale = React.useRef(new Animated.Value(0.8)).current;
    const opacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
            Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true })
        ]).start();
    }, []);

    return (
        <Animated.View style={{
            alignItems: 'center',
            paddingVertical: spacing.xl,
            opacity,
            transform: [{ scale }]
        }}>
            <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: `${theme.palette.primary[500]}10`,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing.l
            }}>
                <CheckCircle2 size={42} color={theme.palette.primary[500]} />
            </View>
            <Text variant="h3" weight="bold">Ticket Received!</Text>
            <Text variant="bodyLarge" color={theme.text.secondary} style={{ textAlign: 'center', marginTop: 8, paddingHorizontal: 20 }}>
                We've received your request. A support specialist will contact you via email shortly.
            </Text>
            <Button
                title="Done"
                onPress={onClose}
                style={{ marginTop: spacing.xl, width: '100%' }}
                variant="outline"
            />
        </Animated.View>
    );
};

export const SupportModal = React.memo(({ visible, onClose, theme }: SupportModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isMessageFocused, setIsMessageFocused] = useState(false);
    const [form, setForm] = useState({ subject: '', category: 'General', message: '' });

    const categories = useMemo(() => [
        { name: 'General', icon: MessageSquare },
        { name: 'Technical', icon: Zap },
        { name: 'Billing', icon: CreditCard },
        { name: 'Account', icon: User },
        { name: 'Other', icon: MoreHorizontal },
    ], []);

    const handleSubmit = async () => {
        if (!form.subject || !form.message) return;

        setIsLoading(true);
        try {
            await SupportService.createTicket(form);
            haptics.impact();
            setIsSuccess(true);
        } catch (e: any) {
            // Error handling remains but logic shifts to success view on resolved
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = useCallback(() => {
        setIsSuccess(false);
        setForm({ subject: '', category: 'General', message: '' });
        onClose();
    }, [onClose]);

    return (
        <BaseEditModal visible={visible} title="Help & Support" onClose={handleClose}>
            {isSuccess ? (
                <SuccessView theme={theme} onClose={handleClose} />
            ) : (
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: spacing.xxl }}
                    enableOnAndroid={true}
                    extraScrollHeight={100}
                    enableAutomaticScroll={true}
                >
                    <View style={{ gap: spacing.l }}>
                        <View style={{ alignItems: 'center', marginTop: spacing.s }}>
                            <View style={{
                                width: 64,
                                height: 64,
                                borderRadius: 32,
                                backgroundColor: `${theme.palette.secondary[400]}10`,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: spacing.m
                            }}>
                                <Headphones size={30} color={theme.palette.secondary[400]} />
                            </View>
                            <Text variant="h3" weight="bold">How can we help?</Text>
                            <Text variant="caption" color={theme.text.tertiary} style={{ marginTop: 4 }}>
                                Typically responds in under 24 hours
                            </Text>
                        </View>

                        <View style={{ gap: spacing.m }}>
                            <View>
                                <Input
                                    label="What's happening?"
                                    placeholder="Brief summary of your issue"
                                    value={form.subject}
                                    onChangeText={t => setForm(p => ({ ...p, subject: t }))}
                                />
                                <VerificationBadge visible={form.subject.trim().length > 3} style={{ top: 42, right: 12 }} />
                            </View>

                            <View>
                                <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 }}>
                                    Select a Topic
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                    {categories.map(({ name, icon: Icon }) => (
                                        <TouchableOpacity
                                            key={name}
                                            onPress={() => {
                                                haptics.selection();
                                                setForm(p => ({ ...p, category: name }));
                                            }}
                                            activeOpacity={0.7}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                paddingVertical: 10,
                                                paddingHorizontal: 16,
                                                borderRadius: radius.l,
                                                borderWidth: 1.5,
                                                borderColor: form.category === name ? theme.palette.primary[500] : theme.border.subtle,
                                                backgroundColor: form.category === name ? `${theme.palette.primary[500]}10` : 'transparent'
                                            }}
                                        >
                                            <Icon size={16} color={form.category === name ? theme.palette.primary[500] : theme.text.secondary} />
                                            <Text
                                                variant="caption"
                                                weight={form.category === name ? "bold" : "bold"}
                                                color={form.category === name ? theme.palette.primary[500] : theme.text.secondary}
                                                style={{ marginLeft: 8 }}
                                            >
                                                {name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View>
                                <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }}>
                                    Detailed Message
                                </Text>
                                <View>
                                    <TextInput
                                        placeholder="Tell us more so we can help you faster..."
                                        placeholderTextColor={theme.text.tertiary}
                                        value={form.message}
                                        onChangeText={t => setForm(p => ({ ...p, message: t }))}
                                        multiline
                                        maxLength={1000}
                                        style={[
                                            {
                                                backgroundColor: theme.background.subtle,
                                                borderRadius: radius.m,
                                                padding: spacing.m,
                                                borderWidth: 1.5,
                                                borderColor: isMessageFocused ? theme.palette.primary[500] : theme.border.subtle,
                                                color: theme.text.primary,
                                                fontSize: 16,
                                                height: 160,
                                                textAlignVertical: 'top',
                                            },
                                            isMessageFocused && {
                                                backgroundColor: theme.background.default,
                                                shadowColor: theme.palette.primary[500],
                                                shadowOffset: { width: 0, height: 4 },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 10,
                                                elevation: 2
                                            }
                                        ]}
                                        onFocus={() => setIsMessageFocused(true)}
                                        onBlur={() => setIsMessageFocused(false)}
                                    />
                                    <VerificationBadge visible={form.message.trim().length > 10} style={{ top: 12, right: 12 }} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                                    <Text variant="caption" color={theme.text.tertiary}>
                                        {form.message.length}/1000
                                    </Text>
                                </View>
                            </View>

                            <Button
                                title="Send Message"
                                isLoading={isLoading}
                                onPress={handleSubmit}
                                style={{ marginTop: spacing.s }}
                                disabled={form.subject.trim().length <= 3 || form.message.trim().length <= 10}
                                rightIcon={<ChevronRight size={18} color="#FFF" />}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            )}
        </BaseEditModal>
    );
});
