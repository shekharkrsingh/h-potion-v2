import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';

interface RadioOptionProps {
    label: string;
    description?: string;
    selected: boolean;
    onSelect: () => void;
    theme: ColorTheme;
}

export const RadioOption = ({
    label,
    description,
    selected,
    onSelect,
    theme
}: RadioOptionProps) => (
    <TouchableOpacity
        style={[
            styles.radioItem,
            {
                borderColor: selected ? theme.palette.primary[500] : theme.border.subtle,
                backgroundColor: selected ? `${theme.palette.primary[500]}05` : 'transparent'
            }
        ]}
        onPress={onSelect}
        activeOpacity={0.7}
    >
        <View style={styles.radioRow}>
            <View style={[
                styles.radioCircle,
                { borderColor: selected ? theme.palette.primary[500] : theme.text.tertiary }
            ]}>
                {selected && (
                    <View style={[
                        styles.radioDot,
                        { backgroundColor: theme.palette.primary[500] }
                    ]} />
                )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                    variant="bodyLarge"
                    weight="bold"
                    color={selected ? theme.palette.primary[700] : theme.text.primary}
                >
                    {label}
                </Text>
                {description && (
                    <Text
                        variant="caption"
                        color={selected ? theme.palette.primary[600] : theme.text.secondary}
                    >
                        {description}
                    </Text>
                )}
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    radioItem: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 8,
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5
    },
});
