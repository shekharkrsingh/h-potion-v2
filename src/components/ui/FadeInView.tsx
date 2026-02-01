import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface FadeInViewProps {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
    style?: StyleProp<ViewStyle>;
    useScale?: boolean; // New prop for "pop" effect
    translateYOffset?: number; // Starting Y offset
    trigger?: any; // Change this to trigger re-animation
}

/**
 * A reusable component that fades in its children when mounted.
 * Now supports a "pop" scale effect for a more premium entrance.
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
    children,
    duration = 500,
    delay = 0,
    style,
    useScale = true,
    translateYOffset = 15,
    trigger,
}) => {
    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animValue.setValue(0);
        Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
        }).start();
    }, [animValue, duration, delay, trigger]);

    const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [translateYOffset, 0],
    });

    const scale = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [useScale ? 0.95 : 1, 1],
    });

    return (
        <Animated.View
            style={[
                {
                    opacity: animValue,
                    transform: [{ translateY }, { scale }],
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
};
