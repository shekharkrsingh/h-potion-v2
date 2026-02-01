import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BaseEditModalProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export const BaseEditModal: React.FC<BaseEditModalProps> = ({
    visible,
    title,
    onClose,
    children
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [showModal, setShowModal] = useState(visible);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (visible) {
            setShowModal(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 9,
                    tension: 40,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT + insets.bottom + 100,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start(() => setShowModal(false));
        }
    }, [visible, insets.bottom]);

    if (!showModal) return null;

    return (
        <Modal
            visible={true}
            transparent={true}
            animationType="none"
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View
                    style={[
                        styles.content,
                        {
                            backgroundColor: theme.mode === 'dark' ? 'rgba(23, 23, 23, 0.98)' : theme.background.default,
                            borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : theme.border.subtle,
                            paddingBottom: spacing.xxl + insets.bottom,
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={[styles.handle, { backgroundColor: theme.border.subtle }]} />
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={theme.text.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.body}>
                        {children}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    content: {
        borderTopLeftRadius: radius.xxl,
        borderTopRightRadius: radius.xxl,
        paddingTop: spacing.m,
        paddingHorizontal: spacing.l,
        maxHeight: '94%',
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 0,
        ...shadows.xl,
        shadowColor: '#000',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: spacing.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    title: {
        fontSize: 20,
        fontFamily: typography.fontFamily.bold,
    },
    closeButton: {
        padding: spacing.s,
    },
    body: {
        flex: 0,
    }
});
