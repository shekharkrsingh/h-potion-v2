import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OfflineScreenProps {
    isOffline: boolean;
    children?: React.ReactNode;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({ isOffline, children }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    
    // Total height of the banner (top inset + content padding)
    const topInset = insets?.top || 0;
    const EXTRA_HEIGHT = (Platform.OS === 'ios' ? 0 : 5) + 24;
    const BANNER_HEIGHT = topInset + EXTRA_HEIGHT; 
    
    const bannerTranslateY = useRef(new Animated.Value(-BANNER_HEIGHT)).current;
    const contentTranslateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOffline) {
            // Slide banner down and push content down slightly
            Animated.parallel([
                Animated.timing(bannerTranslateY, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(contentTranslateY, {
                    toValue: EXTRA_HEIGHT,
                    duration: 400,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true, // Switched to true for 60fps GPU acceleration
                })
            ]).start();
        } else {
            // Slide up
            Animated.parallel([
                Animated.timing(bannerTranslateY, {
                    toValue: -BANNER_HEIGHT, // Only slide up by exact height to match speeds
                    duration: 350,
                    easing: Easing.inOut(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(contentTranslateY, {
                    toValue: 0,
                    duration: 350,
                    easing: Easing.inOut(Easing.cubic),
                    useNativeDriver: true, // Switched to true
                })
            ]).start();
        }
    }, [isOffline, BANNER_HEIGHT, EXTRA_HEIGHT]);

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.palette.error[600],
            zIndex: 99999,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 10,
        },
        content: {
            height: BANNER_HEIGHT,
            paddingTop: Platform.OS === 'ios' ? topInset : topInset + 5,
            paddingHorizontal: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            marginLeft: spacing.s,
            color: '#FFFFFF', 
            fontSize: 13,
            fontWeight: '600',
        },
        wrapper: {
            flex: 1,
            backgroundColor: theme.background.canvas, // Prevent white flashes during transform
        }
    });

    return (
        <View style={styles.wrapper}>
            <Animated.View style={[styles.wrapper, { transform: [{ translateY: contentTranslateY }] }]}>
                {children}
            </Animated.View>
            <Animated.View style={[styles.container, { transform: [{ translateY: bannerTranslateY }] }]} pointerEvents="none">
                <View style={styles.content}>
                    <WifiOff size={16} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.text}>
                        No Internet Connection. Showing cached data.
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
};
