import React, { useRef } from 'react';
import { Animated, TouchableWithoutFeedback, ViewProps } from 'react-native';
import { haptics } from '@/utils/haptics';

interface ScalePressProps extends ViewProps {
    children: React.ReactNode;
    onPress?: () => void;
    scaleTo?: number;
    duration?: number;
    disabled?: boolean;
}

export const ScalePress: React.FC<ScalePressProps> = ({
    children,
    onPress,
    scaleTo = 0.97,
    duration = 150,
    disabled = false,
    style,
    ...props
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (disabled) return;
        haptics.impact();
        Animated.spring(scaleAnim, {
            toValue: scaleTo,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        if (disabled) return;
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 10,
        }).start();
    };

    return (
        <TouchableWithoutFeedback
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Animated.View
                style={[
                    style,
                    {
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
                {...props}
            >
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};
