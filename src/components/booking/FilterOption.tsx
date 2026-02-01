import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';
import { haptics } from '@/utils/haptics';
import { styles as componentStyles } from '@/styles/components/booking/FilterOption.styles';

interface FilterOptionProps {
    label: string;
    value: string;
    activeFilter: string;
    icon?: React.ReactNode;
    theme: ColorTheme;
    styles: any;
    setActiveFilter: (value: any) => void;
    setShowFilterModal: (show: boolean) => void;
    color?: string;
}

export const FilterOption = ({
    label,
    value,
    activeFilter,
    icon,
    theme,
    styles,
    setActiveFilter,
    setShowFilterModal,
    color
}: FilterOptionProps) => {
    const isDark = theme.mode === 'dark';
    const activeColor = color || theme.palette.primary[500];
    const isActive = activeFilter === value;

    return (
        <TouchableOpacity
            activeOpacity={0.75}
            style={[
                styles.filterOption,
                isActive && {
                    backgroundColor: isDark ? activeColor + '33' : activeColor + '10',
                    borderColor: activeColor + '40',
                }
            ]}
            onPress={() => {
                setActiveFilter(value);
                setShowFilterModal(false);
                haptics.selection();
            }}
        >
            <View style={componentStyles.iconRow}>
                <View style={[
                    componentStyles.iconContainer,
                    {
                        backgroundColor: isActive ? activeColor : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                    }
                ]}>
                    {icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
                        color: isActive ? '#FFFFFF' : (color || theme.text.secondary),
                        size: 16
                    }) : icon}
                </View>
                <View style={componentStyles.labelContainer}>
                    <Text
                        variant="bodyMedium"
                        weight={isActive ? "bold" : "semiBold"}
                        color={isActive ? activeColor : theme.text.primary}
                        style={componentStyles.labelText}
                    >
                        {label}
                    </Text>
                </View>
            </View>
            {isActive && (
                <View style={[componentStyles.checkmark, { backgroundColor: activeColor }]}>
                    <CheckCircle2 size={10} color="#FFFFFF" />
                </View>
            )}
        </TouchableOpacity>
    );
};
