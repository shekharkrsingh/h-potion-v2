import React from 'react';
import { View, Text, Image, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

interface PatientAvatarProps {
    name: string;
    avatar?: string;
    size?: number;
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    initialsStyle?: StyleProp<TextStyle>;
    variant?: 'default' | 'emergency';
}

export const PatientAvatar: React.FC<PatientAvatarProps> = ({
    name,
    avatar,
    size = 44,
    containerStyle,
    imageStyle,
    initialsStyle,
    variant = 'default',
}) => {
    const { theme } = useTheme();

    const getInitials = (fullName: string) => {
        const names = fullName.trim().split(' ');
        if (names.length === 0) return '';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const initials = getInitials(name);
    const isEmergency = variant === 'emergency';

    const baseContainerStyle: ViewStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: isEmergency ? theme.status.error + '10' : theme.palette.primary[50],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: isEmergency ? theme.status.error : theme.palette.primary[100],
    };

    const baseInitialsStyle: TextStyle = {
        fontSize: size * 0.4,
        fontWeight: '600',
        color: isEmergency ? theme.status.error : theme.palette.primary[600],
    };

    if (avatar) {
        return (
            <Image
                source={{ uri: avatar }}
                style={[
                    baseContainerStyle as ImageStyle,
                    { borderWidth: 2 },
                    imageStyle,
                ]}
                resizeMode="cover"
            />
        );
    }

    return (
        <View style={[baseContainerStyle, containerStyle]}>
            <Text style={[baseInitialsStyle, initialsStyle]}>
                {initials}
            </Text>
        </View>
    );
};
