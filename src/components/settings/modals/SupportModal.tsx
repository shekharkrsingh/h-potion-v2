import React, { useState, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
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
                            <Input
                                label="What's happening?"
                                placeholder="Brief summary of your issue"
                                value={form.subject}
                                onChangeText={t => setForm(p => ({ ...p, subject: t }))}
                            />

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
                                <Input
                                    label="Detailed Message"
                                    placeholder="Tell us more so we can help you faster..."
                                    multiline
                                    numberOfLines={5}
                                    style={{ height: 140, textAlignVertical: 'top', paddingTop: 12 }}
                                    value={form.message}
                                    onChangeText={t => setForm(p => ({ ...p, message: t }))}
                                />
                                <Text variant="caption" color={theme.text.tertiary} style={{ alignSelf: 'flex-end', marginTop: 4, marginRight: 4 }}>
                                    {form.message.length} characters
                                </Text>
                            </View>

                            <Button
                                title="Send Message"
                                isLoading={isLoading}
                                onPress={handleSubmit}
                                style={{ marginTop: spacing.s }}
                                disabled={!form.subject || !form.message}
                                rightIcon={<ChevronRight size={18} color="#FFF" />}
                            />
                        </View>
                    </View>
                </ScrollView>
            )}
        </BaseEditModal>
    );
});
