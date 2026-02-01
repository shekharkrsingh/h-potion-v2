
import React, { useEffect, useRef } from 'react';
import { View, Image, Text, Animated, Easing } from 'react-native';
import { createStyles, getSplashGradient } from '@/styles/splash.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeContext';
import { StatusBar } from 'expo-status-bar';

interface SplashScreenProps {
    onFinish: () => void;
    isReady: boolean;
}

export default function SplashScreen({ onFinish, isReady }: SplashScreenProps) {
    const { theme, isDark } = useTheme();
    const styles = createStyles(theme);
    const gradientColors = getSplashGradient(theme);

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const [animationFinished, setAnimationFinished] = React.useState(false);

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.ease),
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    useNativeDriver: true,
                })
            ]),
            Animated.timing(progressAnimation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false,
                easing: Easing.inOut(Easing.ease),
            }),
            Animated.delay(200)
        ]).start(({ finished }) => {
            if (finished) {
                setAnimationFinished(true);
            }
        });
    }, []);

    useEffect(() => {
        if (animationFinished && isReady) {
            onFinish();
        }
    }, [animationFinished, isReady]);

    const widthInterpolation = progressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <LinearGradient
            colors={gradientColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
        >
            <StatusBar style={isDark ? "light" : "dark"} translucent backgroundColor="transparent" />

            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.appName}>H-Potion</Text>
                    <Text style={styles.tagline}>Modern Solutions, Magical Results.</Text>
                </View>
            </Animated.View>

            <View style={styles.loadingContainer}>
                <View style={styles.loadingBarBackground}>
                    <Animated.View
                        style={[
                            styles.loadingBarFill,
                            { width: widthInterpolation }
                        ]}
                    />
                </View>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        </LinearGradient>
    );
}

