import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { radius } from '@/theme/radius';
import { shadows } from '@/theme/shadows';
import { spacing } from '@/theme/spacing';

interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outlined' | 'flat';
    style?: ViewStyle;
    padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'elevated',
    style,
    padding = 'm',
}) => {
    const { theme } = useTheme();

    const getStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            backgroundColor: theme.background.card,
            borderRadius: radius.l,
            padding: spacing[padding],
        };

        switch (variant) {
            case 'elevated':
                return {
                    ...baseStyle,
                    ...shadows.m,
                };
            case 'outlined':
                return {
                    ...baseStyle,
                    borderWidth: 1,
                    borderColor: theme.border.default,
                };
            case 'flat':
            default:
                return {
                    ...baseStyle,
                    backgroundColor: theme.background.subtle, // Slightly different so its visible on white
                };
        }
    };

    return (
        <View style={[getStyle(), style]}>
            {children}
        </View>
    );
};
