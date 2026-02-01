import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';
import { ScaleButton } from '@/components/ui/ScaleButton';

interface ProfileOptionProps {
    label: string;
    icon: any;
    onPress: () => void;
    iconColor?: string;
    iconBg?: string;
    showDivider?: boolean;
    textColor?: string;
    rightElement?: React.ReactNode;
}

export const ProfileOption = ({
    label,
    icon: Icon,
    onPress,
    iconColor,
    iconBg,
    showDivider = true,
    textColor,
    rightElement
}: ProfileOptionProps) => {
    const { theme } = useTheme();
    const styles = React.useMemo(() => createProfileComponentStyles(theme), [theme]);

    return (
        <View>
            <ScaleButton onPress={onPress}>
                <View style={styles.optionRow}>
                    <View style={[
                        styles.optionIcon,
                        { backgroundColor: iconBg || theme.background.subtle }
                    ]}>
                        <Icon size={20} color={iconColor || theme.palette.primary[500]} />
                    </View>

                    <Text
                        variant="bodyMedium"
                        weight="medium"
                        color={textColor || theme.text.primary}
                        style={styles.optionLabel}
                    >
                        {label}
                    </Text>

                    {rightElement || <ChevronRight size={18} color={theme.text.tertiary} />}
                </View>
            </ScaleButton>
            {showDivider && <View style={styles.optionDivider} />}
        </View>
    );
};
