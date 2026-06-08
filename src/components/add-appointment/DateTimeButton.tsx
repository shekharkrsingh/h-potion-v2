import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';

interface DateTimeButtonProps {
    label: string;
    value: string;
    icon: any;
    onPress: () => void;
    isDark: boolean;
    theme: ColorTheme;
}

export const DateTimeButton = memo(({ label, value, icon: Icon, onPress, isDark, theme }: DateTimeButtonProps) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
            styles.dateTimeButton,
            {
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                borderColor: theme.border.subtle,
            }
        ]}
    >
        <View style={[styles.contentRow, { flex: 1 }]}>
            <View style={[
                styles.iconContainer,
                { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)' }
            ]}>
                <Icon size={16} color={theme.palette.primary[500]} />
            </View>
            <View style={{ flex: 1, paddingRight: spacing.xs }}>
                <Text variant="caption" color={theme.text.tertiary} style={styles.label}>{label}</Text>
                <Text variant="bodyMedium" weight="bold" numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
            </View>
        </View>
    </TouchableOpacity>
));

const styles = StyleSheet.create({
    dateTimeButton: {
        flex: 1,
        padding: spacing.m,
        borderRadius: radius.m,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.s,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginBottom: 2,
    }
});
