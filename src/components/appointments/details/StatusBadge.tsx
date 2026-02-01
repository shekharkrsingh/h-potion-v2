import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createAppointmentDetailComponentStyles } from '@/styles/components/AppointmentDetailComponents.styles';

interface StatusBadgeProps {
    label: string;
    color: string;
    icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, color, icon }) => {
    const { theme, isDark } = useTheme();
    const styles = React.useMemo(() => createAppointmentDetailComponentStyles(theme), [theme]);

    return (
        <View style={[
            styles.statusBadge,
            {
                backgroundColor: isDark ? color + '20' : color + '15',
                borderColor: isDark ? color + '40' : color + '30'
            }
        ]}>
            {icon}
            <Text style={[styles.statusText, { color }]}>{label.toUpperCase()}</Text>
        </View>
    );
};
