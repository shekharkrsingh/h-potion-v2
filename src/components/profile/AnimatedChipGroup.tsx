import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';

interface AnimatedChipGroupProps {
    items: string[];
    theme: ColorTheme;
    styles: any;
}

export const AnimatedChipGroup = React.memo(({ items, theme, styles }: AnimatedChipGroupProps) => {
    const animations = useRef(items.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.stagger(100, animations.map(anim =>
            Animated.spring(anim, {
                toValue: 1,
                useNativeDriver: true,
                damping: 12,
                stiffness: 100,
            })
        )).start();
    }, [items, animations]);

    return (
        <View style={styles.chipContainer}>
            {items.map((item, index) => (
                <Animated.View
                    key={`${item}-${index}`}
                    style={[
                        styles.chip,
                        {
                            opacity: animations[index] || 0,
                            transform: [{
                                scale: (animations[index] || new Animated.Value(0)).interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.5, 1]
                                })
                            }, {
                                translateY: (animations[index] || new Animated.Value(0)).interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [10, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <Text variant="caption" weight="medium" color={theme.text.secondary}>
                        {item}
                    </Text>
                </Animated.View>
            ))}
        </View>
    );
});
