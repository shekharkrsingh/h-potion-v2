import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { Check } from 'lucide-react-native';
import { styles } from '@/styles/components/ui/Checkbox.styles';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, error }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                activeOpacity={0.7}
                style={styles.container}
                onPress={() => onChange(!checked)}
            >
                <View style={[
                    styles.checkbox,
                    {
                        borderColor: error ? theme.status.error : checked ? theme.palette.primary[500] : theme.text.tertiary,
                        backgroundColor: checked ? theme.palette.primary[500] : 'transparent'
                    }
                ]}>
                    {checked && <Check size={14} color="#FFFFFF" />}
                </View>
                <Text variant="bodySmall" color={theme.text.secondary} style={styles.label}>
                    {label}
                </Text>
            </TouchableOpacity>
            {error && (
                <Text variant="caption" color={theme.status.error} style={styles.errorText}>
                    {error}
                </Text>
            )}
        </View>
    );
};
