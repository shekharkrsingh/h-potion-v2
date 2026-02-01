import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';

interface ProfileSummaryHeaderProps {
    profile: any;
    theme: ColorTheme;
    isDark: boolean;
    styles: any;
}

export const ProfileSummaryHeader = React.memo(({
    profile,
    theme,
    isDark,
    styles
}: ProfileSummaryHeaderProps) => {
    // Animation Values
    const slideAnim = useRef(new Animated.Value(100)).current; // Start from right
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    return (
        <Animated.View style={[
            styles.profileSummary,
            {
                // Override "Box" styles for "Flying" aesthetic
                backgroundColor: 'transparent',
                borderWidth: 0,
                shadowOpacity: 0,
                elevation: 0,
                padding: 0,
                paddingVertical: 16,
                marginTop: 24,
                marginBottom: 24,
                transform: [{ translateX: slideAnim }],
                opacity: fadeAnim,
                overflow: 'hidden' // Ensure gradient respects border radius if any, though we are removing borders
            }
        ]}>
            <LinearGradient
                // Gradient fades from Color (Left) to Transparent (Right)
                colors={isDark
                    ? ['rgba(14, 165, 233, 0.15)', 'transparent']
                    : ['rgba(14, 165, 233, 0.08)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ position: 'absolute', top: 0, left: 0, right: -50, bottom: 0, borderRadius: 24 }}
            />

            <View style={styles.profileAvatarWrapper}>
                <Image
                    source={{ uri: profile?.profilePicture }}
                    style={styles.profileAvatar}
                    contentFit="cover"
                    transition={500}
                />
            </View>
            <View style={styles.profileInfo}>
                <Text variant="h3" weight="bold" color={theme.text.primary}>
                    {profile?.firstName} {profile?.lastName}
                </Text>
                <Text variant="bodyLarge" color={theme.text.secondary} style={{ marginTop: 2 }}>
                    {profile?.email}
                </Text>
            </View>
        </Animated.View>
    );
});
