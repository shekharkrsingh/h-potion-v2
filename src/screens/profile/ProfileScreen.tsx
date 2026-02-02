import React, { useState, useRef, useMemo } from 'react';
import { View, ScrollView, Alert, ImageBackground, Animated, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    User,
    Settings,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    MapPin,
    Bell,
    ChevronDown,
    ChevronUp,
    Calendar,
    Clock,
    Award,
    FileText,
    Mail,
    Phone,
    Briefcase,
    Activity,
    Banknote,
    Edit2,
    Building2,
    Hash,
} from 'lucide-react-native';

import { useTheme } from '@/theme/ThemeContext';
import { RootState, AppDispatch } from '@/store';
import { logoutUser } from '@/store/slices/authSlice';
import { fetchProfile } from '@/store/slices/profileSlice';
import { Text } from '@/components/ui/Text';
import { FadeInView } from '@/components/ui/FadeInView';

import { createProfileScreenStyles } from '@/styles/screens/Profile.styles';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { ProfileOption } from '@/components/profile/ProfileOption';
import { ThemeSelector } from '@/components/profile/ThemeSelector';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { DetailRow } from '@/components/profile/DetailRow';
import { AnimatedChipGroup } from '@/components/profile/AnimatedChipGroup';
import { formatPhoneNumber } from '@/utils/formatters';

const ProfileScreen = () => {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    // Memoize styles to prevent object identity changing on every render
    const styles = useMemo(() => createProfileScreenStyles(theme), [theme]);
    const componentStyles = useMemo(() => createProfileComponentStyles(theme), [theme]);

    const [isThemeExpanded, setIsThemeExpanded] = useState(false);
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);

    const { user } = useSelector((state: RootState) => state.auth);
    const { data: profile, isLoading, error, role: profileRole } = useSelector((state: RootState) => state.profile);

    React.useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await dispatch(fetchProfile()).unwrap();
        } catch (err) {
            console.error('[Profile] Refresh failed:', err);
        } finally {
            setRefreshing(false);
        }
    }, [dispatch]);

    useFocusEffect(
        React.useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    if (isLoading && !profile) {
        return <ProfileSkeleton />;
    }

    if (error && !profile) {
        return (
            <View style={styles.errorContainer}>
                <Text variant="h4" color={theme.text.primary} style={styles.errorTitle}>Oops!</Text>
                <Text variant="bodyMedium" color={theme.text.secondary} style={styles.errorMessage}>
                    {error || "Failed to load profile. Please check your connection."}
                </Text>
                <TouchableOpacity
                    onPress={onRefresh}
                    style={styles.retryButton}
                    disabled={refreshing}
                >
                    {refreshing ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text variant="bodyMedium" weight="bold" style={styles.retryButtonText}>Retry</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    const handleLogout = () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await dispatch(logoutUser());
                        router.replace('/(auth)/login');
                    }
                }
            ]
        );
    };

    const fullName = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : undefined;

    const headerOpacity = scrollY.interpolate({
        inputRange: [50, 120],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
        inputRange: [50, 120],
        outputRange: [-10, 0],
        extrapolate: 'clamp',
    });


    const isCollaborator = (profileRole || user?.role) === 'COLLABORATOR';

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.stickyHeader,
                    {
                        height: 60 + insets.top,
                        paddingTop: insets.top,
                        opacity: headerOpacity,
                        transform: [{ translateY: headerTranslateY }],
                    }
                ]}
            >
                <View style={styles.stickyHeaderContent}>
                    <Text variant="h4" weight="bold" color={theme.text.primary}>
                        {profile?.firstName ? (isCollaborator ? `${profile.firstName} ${profile.lastName}` : `Dr. ${profile.firstName} ${profile.lastName}`) : 'Profile'}
                    </Text>
                </View>
            </Animated.View>

            <ImageBackground
                source={isDark
                    ? require('@assets/docbgdark.jpg')
                    : require('@assets/docbglight.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <Animated.ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={[styles.scrollContent, styles.scrollContentNoPadding]}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.palette.primary[500]}
                            colors={[theme.palette.primary[500]]}
                            progressBackgroundColor={theme.background.modal}
                            progressViewOffset={insets.top + 20}
                        />
                    }
                >
                    <ProfileHeader
                        scrollY={scrollY}
                        user={user}
                        profileName={fullName}
                        profileEmail={profile?.email}
                        profileCover={profile?.coverImage}
                        profileBio={profile?.bio}
                        role={profileRole || user?.role}
                    />

                    <View style={styles.sectionsWrapper}>

                        {/* About Me Section - Hidden for Collaborators */}
                        {!isCollaborator && (
                            <FadeInView delay={100} translateYOffset={50}>
                                <ProfileSection title="About Me">
                                    {profile?.about ? (
                                        <View>
                                            <View style={styles.aboutContainer}>
                                                <View style={styles.aboutIcon}>
                                                    <FileText size={18} color={theme.palette.primary[500]} />
                                                </View>
                                                <Text variant="bodyMedium" color={theme.text.secondary} style={styles.aboutText}>
                                                    {isAboutExpanded || profile.about.length <= 100
                                                        ? profile.about
                                                        : `${profile.about.substring(0, 100)}...`}
                                                </Text>
                                            </View>
                                            {profile.about.length > 100 && (
                                                <Text
                                                    variant="caption"
                                                    color={theme.palette.primary[500]}
                                                    weight="bold"
                                                    style={styles.readMoreButton}
                                                    onPress={() => setIsAboutExpanded(!isAboutExpanded)}
                                                >
                                                    {isAboutExpanded ? 'Read Less' : 'Read More'}
                                                </Text>
                                            )}
                                        </View>
                                    ) : (
                                        <Text variant="bodyMedium" color={theme.text.tertiary}>No about info available.</Text>
                                    )}
                                </ProfileSection>
                            </FadeInView>
                        )}

                        {/* Personal Information Section - Filtered for Collaborators */}
                        <FadeInView delay={150} translateYOffset={50}>
                            <ProfileSection title="Personal Information">
                                <View style={styles.detailsContainer}>
                                    <DetailRow label="Full Name" value={fullName || (user?.name || 'N/A')} theme={theme} styles={componentStyles} icon={User} />

                                    {isCollaborator ? (
                                        <>
                                            <DetailRow label="Collaborator ID" value={user?.id || 'N/A'} theme={theme} styles={componentStyles} icon={Hash} />
                                            <DetailRow label="Associated Doctor ID" value={profile?.doctorId || 'N/A'} theme={theme} styles={componentStyles} icon={Shield} />
                                        </>
                                    ) : (
                                        <DetailRow label="Doctor ID" value={profile?.doctorId || 'N/A'} theme={theme} styles={componentStyles} icon={Shield} />
                                    )}

                                    <DetailRow label="Email" value={profile?.email || user?.email || 'N/A'} theme={theme} styles={componentStyles} icon={Mail} />

                                    {!isCollaborator && (
                                        <>
                                            <DetailRow label="Phone" value={formatPhoneNumber(profile?.phoneNumber)} theme={theme} styles={componentStyles} icon={Phone} />

                                            <DetailRow
                                                label="Address"
                                                value={
                                                    profile?.address
                                                        ? `${profile.address.street}, ${profile.address.city}, ${profile.address.state}, ${profile.address.country}, ${profile.address.pincode}`
                                                        : 'N/A'
                                                }
                                                theme={theme}
                                                styles={componentStyles}
                                                icon={MapPin}
                                            />


                                            <DetailRow label="Gender" value={profile?.gender || 'N/A'} theme={theme} styles={componentStyles} icon={User} />
                                            {(profile?.dateOfBirth) && (
                                                <DetailRow label="Date of Birth" value={profile.dateOfBirth} theme={theme} styles={componentStyles} icon={Calendar} />
                                            )}
                                        </>
                                    )}
                                </View>
                            </ProfileSection>
                        </FadeInView>

                        {/* Professional Details - Hidden for Collaborators */}
                        {!isCollaborator && (
                            <FadeInView delay={200} translateYOffset={50}>
                                <ProfileSection title="Professional Details">
                                    <View style={{ gap: 4 }}>
                                        <DetailRow label="Specialization" value={profile?.specialization || 'N/A'} theme={theme} styles={componentStyles} icon={Activity} />
                                        <DetailRow label="Experience" value={profile?.yearsOfExperience ? `${profile.yearsOfExperience} Years` : 'N/A'} theme={theme} styles={componentStyles} icon={Briefcase} />
                                    </View>
                                </ProfileSection>
                            </FadeInView>
                        )}

                        {/* Availability Section */}
                        {!isCollaborator && (
                            <FadeInView delay={250} translateYOffset={50}>
                                <ProfileSection title="Availability">
                                    <View style={{ gap: 16 }}>
                                        {profile?.availableDays && profile.availableDays.length > 0 && (
                                            <View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                    <Calendar size={16} color={theme.text.tertiary} style={{ marginRight: 8 }} />
                                                    <Text variant="caption" color={theme.text.tertiary}>Available Days</Text>
                                                </View>
                                                <AnimatedChipGroup items={profile.availableDays} theme={theme} styles={componentStyles} />
                                            </View>
                                        )}

                                        {profile?.availableTimeSlots && profile.availableTimeSlots.length > 0 && (
                                            <View>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                    <Clock size={16} color={theme.text.tertiary} style={{ marginRight: 8 }} />
                                                    <Text variant="caption" color={theme.text.tertiary}>Time Slots</Text>
                                                </View>
                                                <View style={componentStyles.chipContainer}>
                                                    {profile.availableTimeSlots.map((slot, index) => (
                                                        <View key={index} style={componentStyles.chip}>
                                                            <Text variant="caption" weight="medium" color={theme.text.secondary}>
                                                                {slot.startTime} - {slot.endTime}
                                                            </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </ProfileSection>
                            </FadeInView>
                        )}

                        {/* Achievements */}
                        {(!isCollaborator && profile?.achievementsAndAwards && profile.achievementsAndAwards.length > 0) && (
                            <FadeInView delay={300} translateYOffset={50}>
                                <ProfileSection title="Achievements & Awards">
                                    <View style={{ gap: 12 }}>
                                        {profile.achievementsAndAwards.map((award, index) => (
                                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Award size={18} color={theme.palette.warning?.[500] || '#f59e0b'} style={{ marginRight: 10 }} />
                                                <Text variant="bodyMedium" color={theme.text.primary} style={{ flex: 1 }}>{award}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </ProfileSection>
                            </FadeInView>
                        )}

                        {(!isCollaborator && profile?.education && profile.education.length > 0) && (
                            <FadeInView delay={350} translateYOffset={50}>
                                <ProfileSection title="Education">
                                    <AnimatedChipGroup items={profile.education} theme={theme} styles={componentStyles} />
                                </ProfileSection>
                            </FadeInView>
                        )}

                        {/* Clinic Information */}
                        {!isCollaborator && (
                            <FadeInView delay={400} translateYOffset={50}>
                                <ProfileSection title="Clinic Information">
                                    <View style={{ gap: 4 }}>
                                        <DetailRow label="Clinic Name" value={profile?.clinicName || 'N/A'} theme={theme} styles={componentStyles} icon={Building2} />
                                        <DetailRow
                                            label="Address"
                                            value={[
                                                typeof profile?.clinicAddress === 'string' ? profile?.clinicAddress : (profile?.clinicAddress?.street || profile?.clinicAddress?.address),
                                                profile?.clinicAddress?.city || profile?.clinicCity,
                                                profile?.clinicAddress?.state,
                                                profile?.clinicAddress?.pincode
                                            ].filter(Boolean).join(', ') || 'N/A'}
                                            theme={theme}
                                            styles={componentStyles}
                                            icon={MapPin}
                                        />
                                        <DetailRow label="Contact" value={formatPhoneNumber(profile?.clinicContactNumber)} theme={theme} styles={componentStyles} icon={Phone} />
                                        <DetailRow label="Email" value={profile?.clinicEmail || 'N/A'} theme={theme} styles={componentStyles} icon={Mail} />
                                        <DetailRow label="Fees" value={profile?.consultationFee ? `₹${profile.consultationFee}` : 'N/A'} theme={theme} styles={componentStyles} icon={Banknote} />
                                    </View>
                                </ProfileSection>
                            </FadeInView>
                        )}


                        {/* Actions Section */}
                        <FadeInView delay={450} translateYOffset={50}>
                            <ProfileSection title="Actions">
                                <ProfileOption
                                    label="Edit Profile"
                                    icon={Edit2}
                                    onPress={() => router.push('/profile/edit')}
                                />
                                <ProfileOption
                                    label="Settings"
                                    icon={Settings}
                                    onPress={() => router.push({ pathname: '/settings', params: { reset: 'true' } })}
                                />
                                <View>
                                    <ProfileOption
                                        label="Appearance"
                                        icon={isThemeExpanded ? ChevronUp : ChevronDown}
                                        onPress={() => setIsThemeExpanded(!isThemeExpanded)}
                                        showDivider={false}
                                    />
                                    {isThemeExpanded && (
                                        <View style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                                            <ThemeSelector />
                                        </View>
                                    )}
                                </View>
                            </ProfileSection>
                        </FadeInView>

                        <FadeInView delay={500} translateYOffset={50}>
                            <ProfileSection>
                                <ProfileOption
                                    label="Sign Out"
                                    icon={LogOut}
                                    iconColor={theme.palette.error[500]}
                                    iconBg={theme.palette.error[50]}
                                    textColor={theme.palette.error[600]}
                                    onPress={handleLogout}
                                    showDivider={false}
                                    rightElement={<View />}
                                />
                            </ProfileSection>
                        </FadeInView>

                        <Text style={styles.versionText} variant="caption">
                            Version 0.0.3 (Build 2026.02.01)
                        </Text>
                    </View>
                </Animated.ScrollView>
            </ImageBackground>
        </View >
    );
};

export default ProfileScreen;
