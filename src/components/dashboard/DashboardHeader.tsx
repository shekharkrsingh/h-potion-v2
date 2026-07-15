import React, { useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, User, Sun, Moon, Sunrise, Search } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { PulseView } from '@/components/ui/PulseView';
import { haptics } from '@/utils/haptics';
import { createStyles, getHeaderBackground } from '@/styles/components/dashboard/DashboardHeader.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme/spacing';

interface DashboardHeaderProps {
    userName: string;
    profileImage?: string;
    notificationCount?: number;
    transparent?: boolean;
    workloadSummary?: string;
    isCollaborator?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    userName,
    profileImage,
    notificationCount = 0,
    transparent = false,
    workloadSummary,
    isCollaborator = false,
}) => {
    const { theme, isDark } = useTheme();
    const styles = createStyles(theme);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const [imageError, setImageError] = React.useState(false);

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 20000, // Very slow 20s rotation
                useNativeDriver: true,
            })
        ).start();
    }, [rotateAnim]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Blink Animation for Profile
    const blinkAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false, // Colors need non-native driver usually, or useNativeDriver: false for layout props
                }),
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [blinkAnim]);

    const borderPulse = blinkAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.palette.primary[500] + '00', theme.palette.primary[500]]
    });

    const getGreetingDetails = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good Morning', icon: <Sunrise size={16} color={theme.palette.warning[500]} /> };
        if (hour < 17) return { text: 'Good Afternoon', icon: <Sun size={16} color={theme.palette.warning[500]} /> };
        return { text: 'Good Evening', icon: <Moon size={16} color={theme.palette.primary[400]} /> };
    };

    const { text: greeting, icon: GreetingIcon } = getGreetingDetails();

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: getHeaderBackground(transparent, isDark),
                paddingTop: insets.top + (spacing.m), // Combine spacing token with inset
            }
        ]}>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push('/(tabs)/profile')}
                style={styles.profileSection}
            >
                <Animated.View style={[
                    styles.avatarContainer,
                    {
                        borderWidth: 2,
                        borderColor: borderPulse,
                        borderRadius: 999
                    }
                ]}>
                    {profileImage && !imageError ? (
                        <Image
                            source={{ uri: profileImage }}
                            style={styles.avatar}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <View style={styles.defaultAvatar}>
                            <User size={24} color={theme.icon.default} />
                        </View>
                    )}
                </Animated.View>
                <View style={styles.greetingContainer}>
                    <View style={styles.greetingRow}>
                        <Image
                            source={require('@assets/logo.png')}
                            style={{ width: 16, height: 16, marginRight: 6 }}
                            resizeMode="contain"
                        />
                        <Text style={styles.greeting} color={theme.text.secondary}>{greeting}</Text>
                        <Animated.View style={{ transform: [{ rotate }] }}>
                            {GreetingIcon}
                        </Animated.View>
                    </View>
                    <Text style={styles.name} weight="bold" color={theme.text.primary}>
                        {isCollaborator ? '' : 'Dr. '}{userName}
                    </Text>
                    {workloadSummary && (
                        <Text variant="caption" color={theme.palette.primary[500]} style={styles.workloadText}>
                            {workloadSummary}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                        haptics.impact();
                        router.push('/appointments' as any);
                    }}
                >
                    <Search size={22} color={theme.icon.default} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                        haptics.impact();
                        router.push('/(tabs)/notifications' as any);
                    }}
                >
                    <View style={{ position: 'relative' }}>
                        <Bell size={22} color={theme.icon.default} />
                        {notificationCount > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: -6,
                                right: -8,
                                backgroundColor: theme.status.error,
                                minWidth: 18,
                                height: 18,
                                borderRadius: 9,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 4,
                                borderWidth: 1.5,
                                borderColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 1)' : '#FFFFFF'
                            }}>
                                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold', textAlign: 'center', lineHeight: 12 }}>{notificationCount > 99 ? '99+' : notificationCount}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        </View >
    );
};
