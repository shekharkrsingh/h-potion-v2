import React from 'react';
import { View, Switch, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { haptics } from '@/utils/haptics';
import { ColorTheme } from '@/theme/colors';
import { styles } from '@/styles/components/settings/ToggleRow.styles';

interface ToggleRowProps {
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (v: boolean) => void;
    icon: any;
    color: string;
    theme: ColorTheme;
}

export const ToggleRow = ({
    label,
    description,
    value,
    onValueChange,
    icon: Icon,
    color,
    theme
}: ToggleRowProps) => (
    <View style={styles.toggleRow}>
        <View style={[styles.miniIcon, { backgroundColor: `${color}15` }]}>
            <Icon size={18} color={color} />
        </View>
        <View style={styles.textContainer}>
            <Text variant="bodyLarge" weight="medium" color={theme.text.primary}>{label}</Text>
            {description && (
                <Text variant="caption" color={theme.text.tertiary} style={styles.description}>
                    {description}
                </Text>
            )}
        </View>
        <Switch
            value={value}
            onValueChange={(v) => {
                haptics.selection();
                onValueChange(v);
            }}
            trackColor={{
                false: theme.background.subtle,
                true: theme.palette.primary[500]
            }}
            thumbColor={Platform.OS === 'android' ? (value ? theme.palette.primary[50] : '#f4f3f4') : undefined}
        />
    </View>
);
