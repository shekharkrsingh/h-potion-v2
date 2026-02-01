import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { typography } from '@/theme/typography';

export interface TextProps extends RNTextProps {
    variant?: keyof typeof typography.presets;
    color?: string;
    weight?: keyof typeof typography.weights;
    align?: TextStyle['textAlign'];
    size?: number; // Custom override
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
    variant = 'bodyMedium',
    color,
    weight,
    align,
    size,
    style,
    children,
    ...props
}) => {
    const { theme } = useTheme();

    const textStyle: TextStyle = {
        ...typography.presets[variant],
        color: color || theme.text.primary,
        textAlign: align,
    };

    if (weight) {
        textStyle.fontWeight = typography.weights[weight];
        // Map weights to font families for Outfit
        if (weight === 'bold') textStyle.fontFamily = typography.fontFamily.bold;
        else if (weight === 'medium') textStyle.fontFamily = typography.fontFamily.medium;
        else if (weight === 'semiBold') textStyle.fontFamily = typography.fontFamily.semiBold;
        else if (weight === 'regular') textStyle.fontFamily = typography.fontFamily.regular;
    }

    if (size) {
        textStyle.fontSize = size;
    }

    return (
        <RNText style={[textStyle, style]} {...props}>
            {children}
        </RNText>
    );
};
