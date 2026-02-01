import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { getGlassStyle } from '@/styles/common';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: ViewStyle;
    circle?: boolean;
}

/**
 * A reusable glass-themed skeleton component with shimmer animation.
 * Mimics the dashboard's glass aesthetic while loading.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
    width: propWidth,
    height,
    borderRadius = 8,
    style,
    circle = false,
}) => {
    const { theme } = useTheme();
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const [layoutWidth, setLayoutWidth] = React.useState<number>(0);

    useEffect(() => {
        const startAnimation = () => {
            shimmerAnim.setValue(0);
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }).start(() => startAnimation());
        };
        startAnimation();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-(layoutWidth || 200), (layoutWidth || 200)],
    });

    const skeletonStyle: ViewStyle = {
        width: propWidth,
        height,
        borderRadius: circle ? 9999 : borderRadius,
        backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
    };

    return (
        <View
            style={[skeletonStyle, style]}
            onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
        >
            <Animated.View
                style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)',
                    transform: [{ translateX }, { skewX: '-20deg' }],
                    opacity: 0.5,
                }}
            />
        </View>
    );
};
