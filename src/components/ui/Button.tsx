import React, { useMemo } from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from './Text';
import { spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { createStyles } from '@/styles/components/ui/Button.styles';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    fullWidth?: boolean;
    textColor?: string;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    style,
    fullWidth = false,
    textColor,
}) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const getBackgroundColor = () => {
        if (disabled) return theme.palette.neutral[200];
        switch (variant) {
            case 'primary': return theme.palette.primary[500];
            case 'secondary': return theme.palette.secondary[500];
            case 'danger': return theme.status.error;
            case 'outline':
            case 'ghost': return 'transparent';
            default: return theme.palette.primary[500];
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.text.tertiary;
        if (textColor) return textColor;

        switch (variant) {
            case 'primary':
            case 'secondary':
            case 'danger':
                return '#FFFFFF';
            case 'outline': return theme.palette.primary[500];
            case 'ghost': return theme.text.primary;
            default: return '#FFFFFF';
        }
    };

    const getBorder = (): ViewStyle => {
        if (variant === 'outline') {
            return {
                borderWidth: 1.5,
                borderColor: disabled ? theme.palette.neutral[300] : theme.palette.primary[500],
            };
        }
        return {};
    };

    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'sm': return { paddingVertical: spacing.xs, paddingHorizontal: spacing.m, minHeight: 36 };
            case 'lg': return { paddingVertical: spacing.m, paddingHorizontal: spacing.xl, minHeight: 60 };
            case 'md':
            default: return { paddingVertical: spacing.s, paddingHorizontal: spacing.xl, minHeight: 56 };
        }
    };

    const getTextVariant = () => {
        switch (size) {
            case 'sm': return 'caption';
            case 'lg': return 'h4';
            case 'md':
            default: return 'button';
        }
    };

    const shadowStyle = ['primary', 'secondary', 'danger'].includes(variant) && !disabled
        ? shadows.s
        : {};

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    width: fullWidth ? '100%' : 'auto',
                    opacity: disabled ? 0.6 : 1,
                },
                getSizeStyle(),
                getBorder(),
                shadowStyle,
                style,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <>
                    {leftIcon}
                    <Text
                        variant={getTextVariant()}
                        color={getTextColor()}
                        weight="semiBold"
                        style={[(leftIcon || rightIcon) ? styles.text : null]}
                    >
                        {title}
                    </Text>
                    {rightIcon}
                </>
            )}
        </TouchableOpacity>
    );
};


