import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image, Animated, SafeAreaView, Dimensions } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { typography } from '@/theme/typography';
import { X, Camera, ImageIcon } from 'lucide-react-native';

const { height } = Dimensions.get('window');

interface ImagePreviewModalProps {
    visible: boolean;
    imageUri: string | null;
    type: 'profile' | 'cover';
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    visible,
    imageUri,
    type,
    onConfirm,
    onCancel,
    loading
}) => {
    const { theme, isDark } = useTheme();
    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 30,
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
                    toValue: height,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    if (!visible || !imageUri) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            statusBarTranslucent={true}
            onRequestClose={onCancel}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.background.modal,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <SafeAreaView style={styles.safeContainer}>
                        <View style={styles.header}>
                            <View style={styles.titleInfo}>
                                <View style={[styles.titleIconWrapper, { backgroundColor: theme.palette.primary[50] }]}>
                                    {type === 'profile' ? (
                                        <Camera size={20} color={theme.palette.primary[500]} />
                                    ) : (
                                        <ImageIcon size={20} color={theme.palette.primary[500]} />
                                    )}
                                </View>
                                <Text style={[styles.title, { color: theme.text.primary }]}>
                                    Confirm {type === 'profile' ? 'Profile' : 'Cover'} Photo
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={onCancel}
                                disabled={loading}
                                style={[styles.closeButton, {
                                    backgroundColor: theme.background.modal,
                                    borderWidth: 1,
                                    borderColor: theme.border.subtle,
                                    ...theme.mode === 'dark' ? { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5 } : {}
                                }]}
                            >
                                <X size={20} color={theme.text.primary} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.previewWrapper}>
                            <Image
                                source={{ uri: imageUri }}
                                style={[
                                    styles.previewImage,
                                    type === 'profile' ? styles.profileImage : styles.coverImage
                                ]}
                                resizeMode="cover"
                            />
                            <View style={[styles.badge, { backgroundColor: theme.palette.primary[500] }]}>
                                <Text style={styles.badgeText}>New Preview</Text>
                            </View>
                        </View>

                        <View style={styles.infoBox}>
                            <Text style={[styles.infoText, { color: theme.text.secondary }]}>
                                This image will be visible to all users. Make sure it represents you professionally.
                            </Text>
                        </View>

                        <View style={styles.footer}>
                            <Button
                                title="Upload & Save Change"
                                onPress={onConfirm}
                                isLoading={loading}
                                fullWidth
                                variant="primary"
                            />
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={onCancel}
                                disabled={loading}
                                fullWidth
                            />
                        </View>
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'flex-end',
    },
    container: {
        width: '100%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: '85%',
    },
    safeContainer: {
        padding: spacing.l,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
        paddingTop: spacing.s,
    },
    titleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: typography.fontFamily.bold,
    },
    titleIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.s,
        marginBottom: spacing.xl,
        position: 'relative',
    },
    previewImage: {
        backgroundColor: '#F1F5F9', // Light gray placeholder
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    profileImage: {
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    coverImage: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    badge: {
        position: 'absolute',
        bottom: -10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: typography.fontFamily.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoBox: {
        marginBottom: spacing.xl,
        padding: spacing.m,
        borderRadius: radius.m,
        backgroundColor: 'rgba(14, 165, 233, 0.05)',
        borderLeftWidth: 4,
        borderLeftColor: '#0EA5E9',
    },
    infoText: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'center',
    },
    footer: {
        gap: 12,
        paddingBottom: spacing.m,
    }
});
