import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
import { Camera, ImageIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';
import { spacing } from '@/theme/spacing';

interface EditImageHeaderProps {
    profileUri?: string;
    coverUri?: string;
    onEditProfile: () => void;
    onEditCover: () => void;
    scrollY?: Animated.Value;
}

export const EditImageHeader: React.FC<EditImageHeaderProps> = ({
    profileUri,
    coverUri,
    onEditProfile,
    onEditCover,
    scrollY,
}) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const styles = React.useMemo(() => createEditComponentStyles(theme), [theme]);

    const headerTranslateY = scrollY?.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: [0, 0, 50],
        extrapolate: 'clamp',
    });

    const headerScale = scrollY?.interpolate({
        inputRange: [-200, 0],
        outputRange: [1.5, 1],
        extrapolateLeft: 'extend',
        extrapolateRight: 'clamp',
    });

    return (
        <View style={styles.headerContainer}>
            <Animated.View style={[
                styles.coverWrapper,
                {
                    transform: [
                        { translateY: headerTranslateY || 0 },
                        { scale: headerScale || 1 }
                    ]
                }
            ]}>
                <Image
                    source={{ uri: coverUri || 'https://img.freepik.com/free-vector/clean-medical-background_53876-97927.jpg' }}
                    style={styles.coverImage}
                    contentFit="cover"
                    transition={500}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', theme.background.default]}
                    style={styles.coverOverlay}
                />
                <TouchableOpacity
                    style={[
                        styles.editCoverButton,
                        {
                            top: insets.top + spacing.l,
                            zIndex: 20
                        }
                    ]}
                    onPress={onEditCover}
                    activeOpacity={0.7}
                >
                    <ImageIcon size={20} color={theme.palette.primary[500]} />
                </TouchableOpacity>
            </Animated.View>

            <View style={styles.avatarWrapper}>
                <Image
                    source={{ uri: profileUri || 'https://via.placeholder.com/150' }}
                    style={styles.profileImage}
                    transition={300}
                />
                <TouchableOpacity
                    style={styles.editProfileButton}
                    onPress={onEditProfile}
                    activeOpacity={0.8}
                >
                    <Camera size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
