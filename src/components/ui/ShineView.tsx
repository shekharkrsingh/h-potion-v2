import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeContext';
import { createStyles } from '@/styles/components/ui/ShineView.styles';

interface ShineViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    duration?: number;
    delay?: number;
}

export const ShineView: React.FC<ShineViewProps> = ({
    children,
    style,
    duration = 3000,
    delay = 15000
}) => {
    const { isDark, theme } = useTheme();
    const styles = createStyles(theme);
    const shineAnim = useRef(new Animated.Value(-1)).current;
    const [width, setWidth] = React.useState(0);

    useEffect(() => {
        const startAnimation = () => {
            shineAnim.setValue(-1);
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(shineAnim, {
                    toValue: 2,
                    duration: duration,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                })
            ]).start(() => startAnimation());
        };

        const firstStart = setTimeout(startAnimation, 1000);

        return () => {
            clearTimeout(firstStart);
            shineAnim.stopAnimation();
        };
    }, [shineAnim, duration, delay]);

    const translateX = shineAnim.interpolate({
        inputRange: [-1, 2],
        outputRange: [-150, width + 150],
    });

    const shineColor = isDark
        ? theme.palette.primary[400] + '40'
        : 'rgba(255, 255, 255, 0.5)';

    return (
        <View
            style={[styles.container, style]}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        >
            {children}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Animated.View
                    style={[
                        styles.shineWrapper,
                        { transform: [{ translateX }, { rotate: '25deg' }] },
                    ]}
                >
                    <LinearGradient
                        colors={['transparent', shineColor, 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shine}
                    />
                </Animated.View>
            </View>
        </View>
    );
};
