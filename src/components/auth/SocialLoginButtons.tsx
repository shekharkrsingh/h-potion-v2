import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { createStyles } from '@/styles/components/auth/SocialLoginButtons.styles';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

export const SocialLoginButtons = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text variant="caption" color={theme.text.tertiary} style={styles.orText}>
                    Or continue with
                </Text>
                <View style={styles.divider} />
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => { }}
                >
                    <Image
                        source={require('@assets/googleicon.png')}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => { }}
                >
                    <Image
                        source={require('@assets/applelogo.png')}
                        style={[styles.icon, styles.appleIcon]}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};


