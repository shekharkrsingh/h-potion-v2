import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OfflineScreenProps {
    isOffline: boolean;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({ isOffline }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    
    // Total height of the banner (top inset + content padding)
    const BANNER_HEIGHT = (Platform.OS === 'ios' ? insets.top : insets.top + 10) + 40; 
    
    const translateY = useRef(new Animated.Value(-BANNER_HEIGHT)).current;

    useEffect(() => {
        if (isOffline) {
            // Slide down
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }).start();
        } else {
            // Slide up
            Animated.timing(translateY, {
                toValue: -BANNER_HEIGHT * 2, // Ensure it hides completely
                duration: 300,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }).start();
        }
    }, [isOffline, BANNER_HEIGHT]);

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.palette.error[600],
            zIndex: 99999, // Highly elevated above headers
            paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 10,
            paddingBottom: spacing.s,
            paddingHorizontal: spacing.l,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 10,
        },
        text: {
            marginLeft: spacing.s,
            color: '#FFFFFF', // Force white text for contrast on error red
            fontSize: 13,
            fontWeight: '600',
        }
    });

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]} pointerEvents="none">
            <WifiOff size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.text}>
                No Internet Connection. Showing cached data.
            </Text>
        </Animated.View>
    );
};
