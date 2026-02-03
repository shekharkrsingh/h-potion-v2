import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';
import { styles } from '@/styles/components/ui/StatusBadge.styles';

interface StatusBadgeProps {
    status: string;
    theme: ColorTheme;
    isDark: boolean;
}

export const StatusBadge = ({ status, theme, isDark }: StatusBadgeProps) => {
    let color = theme.palette.primary[500];
    let bgColor = `${color}15`;

    if (status === 'ACCEPTED' || status === 'TREATED' || status === 'REACTIVATED') {
        color = theme.status.success;
        bgColor = theme.status.successBg;
    } else if (status === 'CANCELLED' || status === 'REJECTED' || status === 'MISSED') {
        color = theme.status.error;
        bgColor = theme.status.errorBg;
    } else if (status === 'PENDING' || status === 'BOOKED') {
        color = theme.status.warning;
        bgColor = theme.status.warningBg;
    }

    return (
        <View style={[styles.statusBadge, { backgroundColor: bgColor, borderColor: `${color}30` }]}>
            <View style={[styles.statusDot, { backgroundColor: color, shadowColor: color }]} />
            <Text variant="caption" weight="semiBold" style={[styles.statusText, { color }]}>
                {status}
            </Text>
        </View>
    );
};

