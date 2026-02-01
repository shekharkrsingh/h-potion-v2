import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorTheme } from '@/theme/colors';

const { width, height } = Dimensions.get('window');

interface MeshBackgroundProps {
    theme: ColorTheme;
    scrollY?: Animated.Value;
}

export const MeshBackground: React.FC<MeshBackgroundProps> = ({ theme, scrollY }) => {
    const anim = useRef(new Animated.Value(0)).current;

    const parallaxY1 = scrollY ? scrollY.interpolate({
        inputRange: [0, 500],
        outputRange: [0, -100],
        extrapolate: 'clamp'
    }) : new Animated.Value(0);

    const parallaxY2 = scrollY ? scrollY.interpolate({
        inputRange: [0, 500],
        outputRange: [0, -50],
        extrapolate: 'clamp'
    }) : new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 15000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 15000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const translateX1 = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width * 0.2, width * 0.2],
    });

    const translateY1 = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [-height * 0.1, height * 0.1],
    });

    const translateX2 = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [width * 0.3, -width * 0.3],
    });

    return (
        <View style={StyleSheet.absoluteFill}>
            {/* Circle 1 */}
            <Animated.View style={[
                styles.meshCircle,
                {
                    backgroundColor: theme.palette.primary[400] + '15',
                    width: width * 0.8,
                    height: width * 0.8,
                    borderRadius: (width * 0.8) / 2,
                    top: '-10%',
                    left: '-10%',
                    transform: [
                        { translateX: translateX1 },
                        { translateY: Animated.add(translateY1, parallaxY1) }
                    ]
                }
            ]} />

            {/* Circle 2 */}
            <Animated.View style={[
                styles.meshCircle,
                {
                    backgroundColor: theme.palette.secondary[400] + '10',
                    width: width * 0.7,
                    height: width * 0.7,
                    borderRadius: (width * 0.7) / 2,
                    bottom: '15%',
                    right: '-20%',
                    transform: [
                        { translateX: translateX2 },
                        { translateY: parallaxY2 }
                    ]
                }
            ]} />

            {/* Gradient Overlay to soften edges and blend with background */}
            <LinearGradient
                colors={['transparent', theme.background.default]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    meshCircle: {
        position: 'absolute',
        opacity: 0.6,
        // Blurred effect if possible, but opacity + gradient works well
    }
});
