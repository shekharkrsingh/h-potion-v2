import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface PulseViewProps {
    children: React.ReactNode;
    duration?: number;
    style?: ViewStyle;
    active?: boolean;
    scaleTo?: number;
}

/**
 * A component that provides a continuous "heartbeat" pulse effect.
 * Perfect for notification badges or attention-seeking buttons.
 */
export const PulseView: React.FC<PulseViewProps> = ({
    children,
    duration = 1500,
    style,
    active = true,
    scaleTo = 1.2,
}) => {
    const pulseValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (active) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseValue, {
                        toValue: scaleTo,
                        duration: duration / 2,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseValue, {
                        toValue: 1,
                        duration: duration / 2,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseValue.setValue(1);
        }
    }, [active, duration, scaleTo]);

    return (
        <Animated.View
            style={[
                {
                    transform: [{ scale: pulseValue }],
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
};
