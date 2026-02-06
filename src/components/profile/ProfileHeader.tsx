import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit2, Settings } from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';
import { User } from '@/types/auth';
import { getFullImageUrl } from '@/utils/formatters';

interface ProfileHeaderProps {
    user: User | null;
    profileName?: string;
    profileEmail?: string;
    profileBio?: string;
    profileImage?: string; // Explicit prop for fresh profile data
    role?: string;
    onEditPress?: () => void;
    onSettingsPress?: () => void;
    scrollY?: any; // Using any for simplicity with Animated.Value or Animated.ValueXY compatibility
}

// Dummy cover image for medical theme
const DUMMY_COVER = 'https://img.freepik.com/free-vector/clean-medical-background_53876-97927.jpg';

export const ProfileHeader = React.memo(({ user, profileName, profileEmail, profileCover, profileBio, profileImage, role, onEditPress, onSettingsPress }: ProfileHeaderProps & { profileCover?: string }) => {
    const { theme } = useTheme();
    const styles = React.useMemo(() => createProfileComponentStyles(theme), [theme]);

    const [profileError, setProfileError] = React.useState(false);
    const [coverError, setCoverError] = React.useState(false);

    const displayName = profileName || user?.name || 'Guest User';
    const displayBio = profileBio || 'No bio available';
    const coverImageSource = (!coverError && getFullImageUrl(profileCover)) || DUMMY_COVER;

    const initials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const isCollaborator = (role || user?.role) === 'COLLABORATOR';

    return (
        <View style={styles.headerContainer}>
            <Image
                source={{ uri: coverImageSource }}
                style={styles.coverImage}
                resizeMode="cover"
                onError={() => setCoverError(true)}
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.3)', theme.background.default]}
                style={styles.coverImage}
            />

            {/* Header Overlay Actions Removed */}

            <View style={styles.headerContent}>
                <View style={styles.avatarContainer}>
                    {(!profileError && getFullImageUrl(profileImage || user?.profileImage)) ? (
                        <Image
                            source={{ uri: getFullImageUrl(profileImage || user?.profileImage)! }}
                            style={styles.avatarImage}
                            onError={() => setProfileError(true)}
                        />
                    ) : (
                        <Text style={styles.initialsText}>{initials}</Text>
                    )}
                </View>

                <Text variant="h2" weight="bold" color={theme.text.primary} align="center">
                    {!isCollaborator && !displayName.startsWith('Dr.') ? `Dr. ${displayName}` : displayName}
                </Text>

                {!isCollaborator && (
                    <Text
                        variant="bodyMedium"
                        color={theme.text.secondary}
                        align="center"
                        style={styles.bioText}
                    >
                        {displayBio}
                    </Text>
                )}

                {(role || user?.role) && (
                    <View style={[styles.roleBadge, { backgroundColor: theme.palette.primary[100] }]}>
                        <Text variant="caption" weight="bold" color={theme.palette.primary[700]}>
                            {(role || user?.role)?.replace('ROLE_', '')}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
});
