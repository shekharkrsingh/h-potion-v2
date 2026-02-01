import React, { useState, forwardRef } from 'react';
import {
    TextInput,
    View,
    TextInputProps,
    ViewStyle,
    TouchableOpacity
} from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from './Text';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { styles } from '@/styles/components/ui/Input.styles';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    onRightIconPress?: () => void;
}

export const Input = forwardRef<TextInput, InputProps>(({
    label,
    error,
    leftIcon,
    rightIcon,
    containerStyle,
    onRightIconPress,
    style,
    onFocus,
    onBlur,
    editable = true,
    ...props
}, ref) => {
    const { theme, isDark } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const getBorderColor = () => {
        if (error) return theme.status.error;
        if (isFocused) return theme.palette.primary[500];
        // Only show default border in dark mode for visibility
        return isDark ? theme.border.default : 'transparent';
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text variant="caption" color={theme.text.secondary} style={styles.label}>
                    {label}
                </Text>
            )}

            <View style={[
                styles.inputContainer,
                {
                    backgroundColor: editable
                        ? (isDark ? theme.palette.neutral[800] : theme.background.canvas)
                        : theme.background.subtle,
                    borderColor: getBorderColor(),
                    borderRadius: radius.l,
                    borderWidth: 2,
                }
            ]}>
                {leftIcon && (
                    <View style={styles.leftIconContainer}>
                        {leftIcon}
                    </View>
                )}

                <TextInput
                    ref={ref}
                    style={[
                        styles.input,
                        { color: theme.text.primary, paddingLeft: leftIcon ? 0 : spacing.m },
                        style
                    ]}
                    placeholderTextColor={theme.text.tertiary}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    editable={editable}
                    {...props}
                />

                {rightIcon && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        disabled={!onRightIconPress}
                        style={styles.rightIconContainer}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text variant="caption" color={theme.status.error} style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
});
