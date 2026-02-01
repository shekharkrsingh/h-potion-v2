import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

const { width } = Dimensions.get('window');

const ShimmerEffect = ({ style }: { style?: any }) => {
    const { theme } = useTheme();
    const translateX = React.useRef(new Animated.Value(-width)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: width,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    return (
        <View style={[styles.skeletonBase, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, style]}>
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            >
                <View style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)',
                        width: '30%',
                        opacity: 0.5
                    }
                ]} />
            </Animated.View>
        </View>
    );
};

export const EditProfileSkeletons = () => {
    return (
        <View style={styles.container}>
            <ShimmerEffect style={styles.headerSkeleton} />
            <View style={styles.content}>
                <ShimmerEffect style={styles.titleSkeleton} />
                <ShimmerEffect style={styles.cardSkeleton} />
                <ShimmerEffect style={styles.cardSkeleton} />
                <ShimmerEffect style={styles.cardSkeleton} />
                <ShimmerEffect style={styles.cardSkeleton} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skeletonBase: {
        overflow: 'hidden',
        borderRadius: radius.m,
    },
    headerSkeleton: {
        height: 250,
        width: '100%',
        borderRadius: 0,
    },
    content: {
        padding: spacing.l,
        gap: spacing.m,
    },
    titleSkeleton: {
        height: 20,
        width: '40%',
        marginBottom: spacing.s,
    },
    cardSkeleton: {
        height: 80,
        width: '100%',
        borderRadius: radius.xl,
    }
});
