import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    View,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { createStyles } from '@/styles/components/ui/CustomDialog.styles';
import { haptics } from '@/utils/haptics';

export type DialogVariant = 'default' | 'danger' | 'success' | 'warning' | 'info';

export interface DialogAction {
    label: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; // Overrides default styling if needed
}

export interface CustomDialogProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    description?: string | React.ReactNode;
    icon?: React.ReactNode;
    variant?: DialogVariant;
    primaryAction?: DialogAction;
    secondaryAction?: DialogAction;
    hideCloseButton?: boolean;
    dismissOnBackdropPress?: boolean;
    children?: React.ReactNode;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
    visible,
    onClose,
    title,
    description,
    icon,
    variant = 'default',
    primaryAction,
    secondaryAction,
    hideCloseButton = false,
    dismissOnBackdropPress = true,
    children,
}) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [isMounted, setIsMounted] = useState(visible);
    
    // Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (visible) {
            setIsMounted(true);
            
            // Trigger Haptic Feedback based on variant
            switch (variant) {
                case 'danger':
                    haptics.error();
                    break;
                case 'success':
                    haptics.success();
                    break;
                case 'warning':
                    haptics.warning();
                    break;
                case 'info':
                    haptics.impact();
                    break;
                default:
                    haptics.impact();
                    break;
            }

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 150,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setIsMounted(false);
            });
        }
    }, [visible, fadeAnim, scaleAnim, variant]);

    if (!isMounted) return null;

    // Theme adaptations based on variant
    const getVariantColors = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: `${theme.palette.error[500]}15`,
                    iconColor: theme.palette.error[500],
                    primaryBtn: 'danger' as const
                };
            case 'success':
                return {
                    iconBg: `${theme.palette.secondary[500]}15`,
                    iconColor: theme.palette.secondary[500],
                    primaryBtn: 'primary' as const
                };
            case 'warning':
                return {
                    iconBg: `${theme.palette.warning[500]}15`,
                    iconColor: theme.palette.warning[500],
                    primaryBtn: 'warning' as const
                };
            case 'info':
                return {
                    iconBg: `${theme.palette.primary[500]}15`,
                    iconColor: theme.palette.primary[500],
                    primaryBtn: 'primary' as const
                };
            default:
                return {
                    iconBg: theme.background.canvas,
                    iconColor: theme.palette.primary[500],
                    primaryBtn: 'primary' as const
                };
        }
    };

    const variantColors = getVariantColors();

    // Decide Button Layout
    const isHorizontalLayout = secondaryAction && primaryAction && (secondaryAction.label.length + primaryAction.label.length < 20);

    return (
        <Modal transparent visible={isMounted} animationType="none" onRequestClose={onClose}>
            {/* The Backdrop */}
            <TouchableWithoutFeedback onPress={() => dismissOnBackdropPress && onClose()}>
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
            </TouchableWithoutFeedback>

            {/* The Dialog Content (rendered after backdrop so it sits on top) */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={styles.keyboardView}
                pointerEvents="box-none"
            >
                <Animated.View 
                    style={[
                        styles.dialogContainer, 
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    {/* Close Button */}
                    {!hideCloseButton && (
                        <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            <X size={20} color={theme.text.secondary} />
                        </TouchableOpacity>
                    )}

                    <View style={styles.contentContainer}>
                        {/* Icon */}
                        {icon && (
                            <View style={[styles.iconContainer, { backgroundColor: variantColors.iconBg }]}>
                                {React.cloneElement(icon as React.ReactElement<any>, { color: variantColors.iconColor })}
                            </View>
                        )}

                        {/* Title & Description */}
                        <Text variant="h3" style={styles.title}>{title}</Text>
                        
                        {description && (
                            typeof description === 'string' 
                            ? <Text variant="bodyMedium" style={styles.description}>{description}</Text>
                            : description
                        )}

                        {/* Custom Injected Content */}
                        {children && (
                            <View style={styles.customChildrenContainer}>
                                {children}
                            </View>
                        )}
                    </View>

                    {/* Actions */}
                    <View style={[styles.actionsContainer, isHorizontalLayout ? styles.actionRow : styles.actionCol]}>
                        {secondaryAction && (
                            <View style={isHorizontalLayout ? styles.actionFlex : undefined}>
                                <Button
                                    variant={secondaryAction.style || 'outline'}
                                    title={secondaryAction.label}
                                    onPress={secondaryAction.onPress}
                                    disabled={secondaryAction.disabled || secondaryAction.loading}
                                    isLoading={secondaryAction.loading}
                                    fullWidth
                                />
                            </View>
                        )}
                        
                        {primaryAction && (
                            <View style={isHorizontalLayout ? styles.actionFlex : undefined}>
                                <Button
                                    variant={primaryAction.style || (variantColors.primaryBtn === 'danger' ? 'danger' : 'primary')}
                                    title={primaryAction.label}
                                    onPress={primaryAction.onPress}
                                    disabled={primaryAction.disabled || primaryAction.loading}
                                    isLoading={primaryAction.loading}
                                    fullWidth
                                />
                            </View>
                        )}
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
