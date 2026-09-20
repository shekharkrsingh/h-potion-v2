import React from 'react';
import { View, Image, TouchableOpacity, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
    Edit2, 
    Settings, 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    Ban, 
    XCircle, 
    HelpCircle 
} from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';
import { User } from '@/types/auth';
import { getFullImageUrl } from '@/utils/formatters';
import { Avatar } from '@/components/ui/Avatar';

interface ProfileHeaderProps {
    user: User | null;
    profileName?: string;
    profileEmail?: string;
    profileBio?: string;
    profileImage?: string; // Explicit prop for fresh profile data
    role?: string;
    verificationStatus?: string;
    onEditPress?: () => void;
    onSettingsPress?: () => void;
    scrollY?: any; // Using any for simplicity with Animated.Value or Animated.ValueXY compatibility
}

// Dummy cover image for medical theme
const DUMMY_COVER = 'https://img.freepik.com/free-vector/clean-medical-background_53876-97927.jpg';

export const ProfileHeader = React.memo(({ user, profileName, profileEmail, profileCover, profileBio, profileImage, role, verificationStatus, onEditPress, onSettingsPress }: ProfileHeaderProps & { profileCover?: string }) => {
    const { theme } = useTheme();
    const styles = React.useMemo(() => createProfileComponentStyles(theme), [theme]);

    const [profileError, setProfileError] = React.useState(false);
    const [coverError, setCoverError] = React.useState(false);
    const [showTooltip, setShowTooltip] = React.useState(false);

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

    const getStatusIcon = (status: string) => {
        const size = 16;
        switch (status) {
            case 'VERIFIED':
                return <CheckCircle2 size={size} color={theme.status.success} fill={`${theme.status.success}20`} />;
            case 'PENDING':
                return <Clock size={size} color={theme.status.warning} />;
            case 'SUSPENDED':
                return <AlertCircle size={size} color={theme.status.error} />;
            case 'TERMINATED':
                return <Ban size={size} color={theme.status.error} />;
            case 'DENIED':
            case 'REJECTED':
                return <XCircle size={size} color={theme.status.error} />;
            default:
                return <HelpCircle size={size} color={theme.text.tertiary} />;
        }
    };

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
                <View style={{ position: 'relative', marginBottom: 12, zIndex: 20 }}>
                    <View style={[styles.avatarContainer, { marginBottom: 0 }]}>
                        <Avatar
                            uri={getFullImageUrl(profileImage || user?.profileImage)}
                            firstName={displayName.split(' ')[0]}
                            lastName={displayName.split(' ')[1]}
                            style={styles.avatarImage}
                        />
                    </View>
                    {!isCollaborator && verificationStatus && (
                        <View style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 30 }}>
                            <Pressable
                                {...{
                                    onMouseEnter: () => setShowTooltip(true),
                                    onMouseLeave: () => setShowTooltip(false)
                                } as any}
                                onPress={() => setShowTooltip(!showTooltip)}
                                hitSlop={8}
                                style={{
                                    backgroundColor: theme.background.card,
                                    borderRadius: 16,
                                    padding: 4,
                                    borderWidth: 2,
                                    borderColor: theme.border.subtle,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 3,
                                    elevation: 4,
                                    width: 32,
                                    height: 32,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                {getStatusIcon(verificationStatus)}
                            </Pressable>
                            {showTooltip && (
                                <View style={{
                                    position: 'absolute',
                                    bottom: 38,
                                    right: -10,
                                    width: 120,
                                    backgroundColor: theme.background.inverted,
                                    padding: 6,
                                    borderRadius: 4,
                                    zIndex: 1000,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 4,
                                    elevation: 3,
                                    alignItems: 'center'
                                }}>
                                    <Text variant="caption" color={theme.text.inverted} style={{ fontSize: 10, textAlign: 'center', fontWeight: 'bold' }}>
                                        {verificationStatus}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text variant="h2" weight="bold" color={theme.text.primary} align="center">
                        {!isCollaborator && !displayName.startsWith('Dr.') ? `Dr. ${displayName}` : displayName}
                    </Text>
                </View>

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
