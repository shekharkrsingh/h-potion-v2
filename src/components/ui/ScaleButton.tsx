import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle, StyleProp } from 'react-native';

interface ScaleButtonProps {
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    activeScale?: number;
}

export const ScaleButton = ({ onPress, style, children, activeScale = 0.96 }: ScaleButtonProps) => {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scale, {
            toValue: activeScale,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    return (
        <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
            <Animated.View style={[style, { transform: [{ scale }] }]}>
                {children}
            </Animated.View>
        </Pressable>
    );
};
