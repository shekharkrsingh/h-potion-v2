import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    visible: boolean;
    message: string;
    type: ToastType;
    onHide: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    type,
    onHide,
    duration = 3000,
}) => {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();

    // Animations
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Reset state
            progress.setValue(0);

            // Show Animation
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                    // Spring-like feel for professional entrance
                    // easing: Easing.out(Easing.back(1.5)), 
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Progress Bar Animation
            Animated.timing(progress, {
                toValue: 1,
                duration: duration,
                useNativeDriver: false, // Width change requires JS driver usually, or layout animation
            }).start();

            const timer = setTimeout(() => {
                hide();
            }, duration);

            return () => {
                clearTimeout(timer);
                progress.stopAnimation();
            };
        } else {
            hide();
        }
    }, [visible, duration, message, type]);

    const hide = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -20, // Move up slightly before vanishing or keep consistent exit
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (visible) onHide();
        });
    };

    if (!visible) return null;

    const getStatusColor = () => {
        switch (type) {
            case 'success': return theme.status.success;
            case 'error': return theme.status.error;
            case 'warning': return theme.status.warning;
            case 'info': return theme.status.info;
        }
    };

    const getIcon = () => {
        const color = getStatusColor();
        const size = 24;
        switch (type) {
            case 'success': return <CheckCircle size={size} color={color} fill={isDark ? theme.background.default : theme.status.successBg} />;
            case 'error': return <AlertCircle size={size} color={color} fill={isDark ? theme.background.default : theme.status.errorBg} />;
            case 'warning': return <AlertTriangle size={size} color={color} fill={isDark ? theme.background.default : theme.status.warningBg} />;
            case 'info': return <Info size={size} color={color} fill={isDark ? theme.background.default : theme.status.infoBg} />;
        }
    };

    const statusColor = getStatusColor();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    top: insets.top + 10,
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: theme.background.card, // Correct theme background
                    borderColor: theme.border.subtle,
                    shadowColor: isDark ? '#000' : theme.palette.neutral[400],
                },
            ]}
        >
            {/* Status Strip */}
            <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />

            {/* Content */}
            <View style={styles.contentContainer}>
                <View style={styles.iconWrapper}>
                    {getIcon()}
                </View>

                <View style={styles.textWrapper}>
                    <Text
                        variant="bodyMedium"
                        color={theme.text.primary}
                        style={styles.messageText}
                    >
                        {message}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={hide}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <X size={18} color={theme.text.tertiary} />
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <Animated.View
                    style={{
                        height: 2,
                        backgroundColor: statusColor,
                        width: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%']
                        }),
                    }}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        width: width * 0.92,
        maxWidth: 420,
        borderRadius: 12,
        flexDirection: 'column',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        zIndex: 9999,
        borderWidth: 1,
        overflow: 'hidden', // Ensure progress bar stays inside rounded corners
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingLeft: 12, // Account for visual balance
    },
    statusStrip: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    iconWrapper: {
        marginRight: 12,
        marginLeft: 4,
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    messageText: {
        lineHeight: 20,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    },
    progressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'transparent',
    }
});
