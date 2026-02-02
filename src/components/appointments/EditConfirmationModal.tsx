import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Modal, Animated, TouchableOpacity, ImageBackground, StyleSheet, Platform, Easing } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { Clock, Phone, User, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SummaryRowProps {
    icon: any;
    label: string;
    value: string;
    color?: string;
    theme: any;
    styles: any;
}

const SummaryRow = ({ icon: Icon, label, value, color, theme, styles }: SummaryRowProps) => (
    <View style={styles.summaryRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={[styles.summaryIconContainer, { backgroundColor: color || theme.background.subtle }]}>
                <Icon size={20} color={color ? '#FFFFFF' : theme.text.tertiary} />
            </View>
            <View>
                <Text variant="caption" color={theme.text.tertiary} style={styles.summaryLabel}>{label}</Text>
                <Text variant="bodyLarge" weight="bold" color={theme.text.primary} numberOfLines={1}>{value}</Text>
            </View>
        </View>
        <View style={[styles.verificationBadge, { backgroundColor: theme.palette.primary[500] }]}>
            <Check size={12} color="#FFFFFF" strokeWidth={3} />
        </View>
    </View>
);

interface EditConfirmationModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    data: any;
    isSubmitting?: boolean;
}

export const EditConfirmationModal = ({ visible, onConfirm, onCancel, data, isSubmitting = false }: EditConfirmationModalProps) => {
    const { theme, isDark } = useTheme();
    const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);
    const animValue = useRef(new Animated.Value(0)).current;

    // Internal state to handle close animation
    const [innerVisible, setInnerVisible] = useState(visible);

    useEffect(() => {
        if (visible) {
            setInnerVisible(true);
            Animated.timing(animValue, {
                toValue: 1,
                duration: 400,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setInnerVisible(false);
                }
            });
        }
    }, [visible]);

    if (!innerVisible && (animValue as any)._value === 0) return null;

    const backdropOpacity = animValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const translateY = animValue.interpolate({ inputRange: [0, 1], outputRange: [600, 0] });

    return (
        <Modal
            visible={innerVisible}
            transparent
            statusBarTranslucent={true}
            onRequestClose={onCancel}
            animationType="none"
        >
            <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onCancel} />
                <Animated.View style={[styles.summaryContainer, { transform: [{ translateY }] }]}>
                    <ImageBackground
                        source={isDark ? require('@assets/docbgdark.jpg')
                            : require('@assets/docbglight.jpg')}
                        style={styles.summaryContentWrapper}
                        imageStyle={{ borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
                        blurRadius={20}
                    >
                        <View style={[styles.modalDragHandle, { backgroundColor: theme.border.subtle }]} />
                        <View style={{ paddingHorizontal: spacing.l }}>
                            <Text variant="h3" weight="bold" color={theme.text.primary}>Confirm Changes</Text>
                            <Text variant="bodySmall" color={theme.text.tertiary}>Review the details before saving</Text>

                            <View style={styles.summaryContent}>
                                <SummaryRow
                                    icon={User}
                                    label="Patient"
                                    value={`${data.firstName} ${data.lastName}`.trim()}
                                    theme={theme}
                                    styles={styles}
                                />
                                <SummaryRow
                                    icon={Clock}
                                    label="New Schedule"
                                    value={data.appointmentDateTime.toLocaleString(undefined, {
                                        weekday: 'short', month: 'short', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                    theme={theme}
                                    color={theme.palette.primary[500]}
                                    styles={styles}
                                />
                                {data.contact && (
                                    <SummaryRow
                                        icon={Phone}
                                        label="Contact"
                                        value={data.contact}
                                        theme={theme}
                                        styles={styles}
                                    />
                                )}
                            </View>

                            <View style={styles.summaryFooter}>
                                <TouchableOpacity
                                    onPress={onConfirm}
                                    disabled={isSubmitting}
                                    activeOpacity={0.9}
                                    style={styles.confirmButton}
                                >
                                    <LinearGradient
                                        colors={theme.mode === 'dark' ? ['#0ea5e9', '#0284c7'] : ['#0ea5e9', '#0284c7']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.gradient}
                                    >
                                        <Text weight="bold" style={{ color: '#FFFFFF' }}>CONFIRM UPDATE</Text>
                                        <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                                    <Text color={theme.text.secondary}>Back to Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const createStyles = (theme: any, isDark: boolean) => StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    summaryContainer: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
        backgroundColor: isDark ? theme.background.card : '#FFFFFF',
    },
    summaryContentWrapper: {
        padding: spacing.l,
        paddingBottom: Platform.OS === 'ios' ? 40 : spacing.l,
    },
    modalDragHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.m,
        opacity: 0.5,
    },
    summaryContent: {
        marginTop: spacing.l,
        gap: spacing.m,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    summaryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.m,
    },
    summaryLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    verificationBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryFooter: {
        marginTop: spacing.xl,
        gap: spacing.m,
        alignItems: 'center',
    },
    confirmButton: {
        width: '100%',
        height: 52,
        borderRadius: radius.full,
        overflow: 'hidden',
        shadowColor: '#0ea5e9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.s,
    },
    cancelButton: {
        padding: spacing.s,
    }
});
