import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeContext';
import { View } from 'react-native';

export const ThemedStatusBar = () => {
    const { isDark, theme } = useTheme();

    return (
        <React.Fragment>
            <StatusBar
                style={isDark ? 'light' : 'dark'}
                backgroundColor={theme.background.default}
                translucent={true} // For modern edge-to-edge feel
            />
        </React.Fragment>
    );
};
