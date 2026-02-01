import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createStyles } from '@/styles/components/auth/AuthFooter.styles';

interface AuthFooterProps {
    mode: 'login' | 'signup';
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ mode }) => {
    const { theme } = useTheme();
    const router = useRouter();
    const styles = createStyles(theme);

    const isLogin = mode === 'login';
    const promptText = isLogin ? "Don't have an account?" : "Already have an account?";
    const actionText = isLogin ? "Sign Up" : "Log In";
    const targetRoute = isLogin ? '/(auth)/signup' : '/(auth)/login';

    return (
        <View style={styles.container}>
            <View style={styles.promptContainer}>
                <Text variant="bodySmall" color={theme.text.secondary}>
                    {promptText}
                </Text>
                <TouchableOpacity onPress={() => router.push(targetRoute)}>
                    <Text variant="bodySmall" color={theme.palette.primary[600]} weight="bold" style={styles.actionText}>
                        {actionText}
                    </Text>
                </TouchableOpacity>
            </View>

            {isLogin && (
                <Text variant="caption" color={theme.text.tertiary} align="center" style={styles.termsText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </Text>
            )}
        </View>
    );
};


