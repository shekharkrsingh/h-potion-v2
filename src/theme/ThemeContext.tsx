import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ColorTheme } from './colors';

type ThemeContextType = {
    theme: ColorTheme;
    isDark: boolean;
    mode: 'light' | 'dark' | 'system';
    toggleTheme: () => void;
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
};

const THEME_STORAGE_KEY = '@theme_mode';

const ThemeContext = createContext<ThemeContextType>({
    theme: lightColors,
    isDark: false,
    mode: 'system',
    toggleTheme: () => { },
    setThemeMode: () => { },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<'light' | 'dark' | 'system'>('system');
    const [theme, setTheme] = useState<ColorTheme>(lightColors);

    // Load persisted theme
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (savedMode) {
                    setMode(savedMode as 'light' | 'dark' | 'system');
                }
            } catch (e) {
                console.error('Failed to load theme:', e);
            }
        };
        loadTheme();
    }, []);

    useEffect(() => {
        let activeMode = mode;
        if (mode === 'system') {
            activeMode = systemScheme === 'dark' ? 'dark' : 'light';
        }

        setTheme(activeMode === 'dark' ? darkColors : lightColors);
    }, [mode, systemScheme]);

    const toggleTheme = async () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch (e) {
            console.error('Failed to save theme:', e);
        }
    };

    const setThemeMode = async (newMode: 'light' | 'dark' | 'system') => {
        setMode(newMode);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
        } catch (e) {
            console.error('Failed to save theme:', e);
        }
    };

    const isDark = theme.mode === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, isDark, mode, toggleTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
