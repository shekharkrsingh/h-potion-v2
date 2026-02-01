import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

interface SelectionChipProps {
    label: string;
    active: boolean;
    onPress: () => void;
    icon?: any;
    isDark: boolean;
    theme: ColorTheme;
}

export const SelectionChip = memo(({ label, active, onPress, icon: Icon, isDark, theme }: SelectionChipProps) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
            styles.chip,
            {
                backgroundColor: active
                    ? (isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)')
                    : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
                borderColor: active ? theme.palette.primary[500] : theme.border.subtle,
            }
        ]}
    >
        {Icon && <Icon size={16} color={active ? theme.palette.primary[500] : theme.text.secondary} />}
        <Text
            variant="bodySmall"
            weight={active ? "bold" : "medium"}
            color={active ? theme.palette.primary[500] : theme.text.secondary}
            style={{ marginLeft: Icon ? spacing.xs : 0 }}
        >
            {label}
        </Text>
    </TouchableOpacity>
));

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        borderRadius: radius.full,
        borderWidth: 1,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    }
});
