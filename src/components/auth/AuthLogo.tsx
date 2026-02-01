import React from 'react';
import { View, Image } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { styles } from '@/styles/components/auth/AuthLogo.styles';

export const AuthLogo = () => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, {
            borderRadius: 16,
            width: 80,
            height: 80,
            backgroundColor: theme.background.card,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.palette.primary[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5
        }]}>
            <Image
                source={require('@assets/logo.png')}
                style={{ width: 60, height: 60 }}
                resizeMode="contain"
            />
        </View>
    );
};
