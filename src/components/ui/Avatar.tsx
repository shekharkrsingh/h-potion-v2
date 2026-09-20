import React, { useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';

interface AvatarProps {
    uri?: string | null;
    firstName?: string;
    lastName?: string;
    style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, firstName, lastName, style }) => {
    const { theme } = useTheme();
    const [imageError, setImageError] = useState(false);

    const hasValidImage = uri && !imageError;
    const initials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || '?';

    const styles = StyleSheet.create({
        fallbackContainer: {
            backgroundColor: theme.background.subtle,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        image: {
            overflow: 'hidden',
        }
    });

    if (hasValidImage) {
        return (
            <Image
                source={{ uri }}
                style={[styles.image, style]}
                contentFit="cover"
                transition={300}
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <View style={[styles.fallbackContainer, style]}>
            {/* The text scales automatically but we use a reasonable default size if not explicitly constrained */}
            <Text 
                variant="h2" 
                weight="bold" 
                color={theme.palette.primary[600]}
                style={{ fontSize: 32 }}
                adjustsFontSizeToFit
                numberOfLines={1}
            >
                {initials}
            </Text>
        </View>
    );
};
