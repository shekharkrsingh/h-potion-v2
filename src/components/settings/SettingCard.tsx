import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, Easing, TouchableOpacity } from 'react-native';
import { ChevronRight, Check } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';
import { haptics } from '@/utils/haptics';

interface SettingCardProps {
    index: number;
    icon: any;
    title: string;
    subtitle: string;
    onPress: () => void;
    isFilled?: boolean;
    color?: string;
    theme: ColorTheme;
    componentStyles: any;
}

export const SettingCard = React.memo(({
    index,
    icon: Icon,
    title,
    subtitle,
    onPress,
    isFilled,
    color,
    theme,
    componentStyles,
}: SettingCardProps) => {
    // Scaling Animation
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const iconScale = useRef(new Animated.Value(1)).current;

    // Entrance Animation
    const entranceAnim = useRef(new Animated.Value(0)).current;

    // Shine Animation
    const shineAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.timing(entranceAnim, {
            toValue: 1,
            duration: 600,
            delay: index * 60,
            useNativeDriver: true,
            easing: Easing.out(Easing.back(1.2)),
        }).start();

        const runShine = () => {
            Animated.timing(shineAnim, {
                toValue: 400,
                duration: 1500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
                useNativeDriver: true,
            }).start(() => {
                shineAnim.setValue(-100);
                setTimeout(runShine, 3000 + Math.random() * 5000);
            });
        };
        const timeout = setTimeout(runShine, index * 200 + 1000 + Math.random() * 2000);
        return () => clearTimeout(timeout);
    }, [index]);

    const handlePressIn = () => {
        haptics.impact();
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.98,
                useNativeDriver: true,
                speed: 20,
            }),
            Animated.spring(iconScale, {
                toValue: 1.2,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 20,
            }),
            Animated.spring(iconScale, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    };

    const animatedStyle = {
        opacity: entranceAnim,
        transform: [
            { scale: scaleAnim },
            {
                translateY: entranceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                }),
            },
        ],
    };

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[componentStyles.sectionCard, { overflow: 'hidden' }]}
            >
                <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: 60,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: [{ translateX: shineAnim }, { rotate: '25deg' }],
                    zIndex: 1,
                }} />

                <View style={componentStyles.sectionHeader}>
                    <View style={[
                        componentStyles.iconWrapper,
                        {
                            backgroundColor: color ? `${color}10` : `${theme.palette.primary[500]}10`,
                            borderColor: color ? `${color}20` : `${theme.palette.primary[500]}20`,
                            shadowColor: color || theme.palette.primary[500],
                        }
                    ]}>
                        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                            <Icon size={22} color={color || theme.palette.primary[500]} />
                        </Animated.View>
                    </View>
                    <View style={componentStyles.textWrapper}>
                        <Text style={componentStyles.sectionTitle}>{title}</Text>
                        <Text style={componentStyles.sectionSubtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    </View>
                    <View style={[
                        componentStyles.statusIndicator,
                        isFilled ? componentStyles.statusComplete : componentStyles.statusEmpty,
                        isFilled && { backgroundColor: theme.palette.primary[50], borderColor: theme.palette.primary[100], borderWidth: 1 }
                    ]}>
                        {isFilled ? (
                            <Check size={14} color={theme.palette.primary[400]} />
                        ) : (
                            <ChevronRight size={16} color={theme.text.tertiary} />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});
