import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Sun, Moon, Monitor } from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';
import { haptics } from '@/utils/haptics';

export const ThemeSelector = () => {
    const { theme, mode, setThemeMode } = useTheme();
    const styles = React.useMemo(() => createProfileComponentStyles(theme), [theme]);

    const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
        if (mode !== newMode) {
            haptics.selection();
            setThemeMode(newMode);
        }
    };

    const renderOption = (optionMode: 'light' | 'dark' | 'system', Icon: any, label: string) => {
        const isActive = mode === optionMode;
        return (
            <TouchableOpacity
                onPress={() => handleThemeChange(optionMode)}
                style={[
                    styles.themeOption,
                    isActive && styles.themeOptionActive
                ]}
                activeOpacity={0.7}
            >
                <Icon
                    size={20}
                    color={isActive ? theme.palette.primary[600] : theme.text.tertiary}
                    strokeWidth={isActive ? 2.5 : 2}
                />
                <Text
                    variant="bodySmall"
                    weight={isActive ? 'bold' : 'medium'}
                    color={isActive ? theme.palette.primary[600] : theme.text.tertiary}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.themeSelectorContainer}>
            {renderOption('light', Sun, 'Light')}
            {renderOption('system', Monitor, 'System')}
            {renderOption('dark', Moon, 'Dark')}
        </View>
    );
};
