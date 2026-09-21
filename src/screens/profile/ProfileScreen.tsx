import React, { useState, useRef, useMemo } from 'react';
import { View, ScrollView, ImageBackground, Animated, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    User,
    Settings,
    Shield,
    HelpCircle,
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
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { RootState, AppDispatch } from '@/store';
import { fetchProfile } from '@/store/slices/profileSlice';
import { fetchAssociatedDoctors, fetchActiveDoctorProfile } from '@/store/slices/activeDoctorSlice';
import { Text } from '@/components/ui/Text';
import { FadeInView } from '@/components/ui/FadeInView';

import { createProfileScreenStyles } from '@/styles/screens/Profile.styles';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { ProfileOption } from '@/components/profile/ProfileOption';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { DetailRow } from '@/components/profile/DetailRow';
import { AnimatedChipGroup } from '@/components/profile/AnimatedChipGroup';
import { formatPhoneNumber } from '@/utils/formatters';
import { formatDate } from '@/utils/date';


const ProfileScreen = () => {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    // Memoize styles to prevent object identity changing on every render
    const styles = useMemo(() => createProfileScreenStyles(theme), [theme]);
    const componentStyles = useMemo(() => createProfileComponentStyles(theme), [theme]);

    const [isAboutExpanded, setIsAboutExpanded] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);

    const { user } = useSelector((state: RootState) => state.auth);
    const { data: profile, isLoading, error, role: profileRole } = useSelector((state: RootState) => state.profile);
    const { doctors, activeDoctorId, activeDoctorProfile } = useSelector((state: RootState) => state.activeDoctor);

    const isCollaborator = (profileRole || user?.role) === 'COLLABORATOR';
    const doctorData = isCollaborator ? activeDoctorProfile : profile;

    React.useEffect(() => {
        dispatch(fetchProfile());
        if (isCollaborator) {
            dispatch(fetchAssociatedDoctors());
            dispatch(fetchActiveDoctorProfile());
        }
    }, [dispatch, isCollaborator]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await dispatch(fetchProfile()).unwrap();
            if (isCollaborator) {
                await Promise.all([
                    dispatch(fetchAssociatedDoctors()).unwrap(),
                    dispatch(fetchActiveDoctorProfile()).unwrap()
                ]);
            }
        } catch (err) {
            console.error('[Profile] Refresh failed:', err);
        } finally {
            setRefreshing(false);
        }
    }, [dispatch, isCollaborator]);

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

    const fullName = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : undefined;
    const displayVerificationStatus = profile?.licenseNumber 
        ? (profile.verificationStatus || 'PENDING') 
        : 'NOT SUBMITTED';

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
                        profileImage={profile?.profilePicture}
                        profileCover={profile?.coverPicture}
                        profileBio={profile?.bio}
                        role={profileRole || user?.role}
                        verificationStatus={displayVerificationStatus}
                    />

                    <View style={styles.sectionsWrapper}>

                        {/* About Me Section - Hidden for Collaborators */}
                        {!isCollaborator && profile?.about && (
                            <FadeInView delay={100} translateYOffset={50}>
                                <ProfileSection title="About Me">
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
                                            <DetailRow label="Collaborator ID" value={profile?.collaboratorId || user?.id || 'N/A'} theme={theme} styles={componentStyles} icon={Hash} />
                                            <DetailRow 
                                                label="Currently Managing" 
                                                value={doctors.find(d => d.doctorId === activeDoctorId)?.doctorName || profile?.doctorId || 'N/A'} 
                                                theme={theme} 
                                                styles={componentStyles} 
                                                icon={Shield} 
                                            />
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

                        {/* Associated Doctors Section */}
                        {isCollaborator && (
                            <FadeInView delay={220} translateYOffset={50}>
                                <ProfileSection title="Associated Doctors">
                                    <View style={{ gap: 10 }}>
                                        {doctors.map((doc) => {
                                            const isSelected = doc.doctorId === activeDoctorId;
                                            return (
                                                <View 
                                                    key={doc.doctorId} 
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: spacing.m,
                                                        borderRadius: radius.l,
                                                        borderWidth: 1,
                                                        borderColor: isSelected ? theme.palette.primary[500] : theme.border.subtle,
                                                        backgroundColor: isSelected ? (theme.mode === 'dark' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.05)') : (theme.mode === 'dark' ? 'rgba(255,255,255,0.02)' : theme.background.neutral),
                                                        marginBottom: spacing.xs
                                                    }}
                                                >
                                                    <View style={{ flex: 1 }}>
                                                        <Text variant="bodyMedium" weight="bold" color={theme.text.primary}>
                                                            {doc.doctorName}
                                                        </Text>
                                                        <Text variant="caption" color={theme.text.secondary} style={{ marginTop: 2 }}>
                                                            {doc.specialization || 'General Practitioner'} • Role: {doc.role || 'Collaborator'}
                                                        </Text>
                                                        {doc.clinicName && (
                                                            <Text variant="caption" color={theme.text.tertiary} style={{ marginTop: 2 }}>
                                                                {doc.clinicName}
                                                            </Text>
                                                        )}
                                                    </View>
                                                    {isSelected && (
                                                        <View style={{
                                                            backgroundColor: theme.palette.primary[500],
                                                            paddingHorizontal: 8,
                                                            paddingVertical: 4,
                                                            borderRadius: radius.full
                                                        }}>
                                                            <Text variant="caption" weight="bold" color="#fff">ACTIVE</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            );
                                        })}
                                    </View>
                                </ProfileSection>
                            </FadeInView>
                        )}

                        {/* Professional Details - Hidden for Collaborators */}
                        {!isCollaborator && (
                            <FadeInView delay={200} translateYOffset={50}>
                                <ProfileSection title="Professional Details">
                                    <View style={{ gap: 4 }}>
                                        <DetailRow label="Specialization" value={profile?.specialization || 'N/A'} theme={theme} styles={componentStyles} icon={Activity} />
                                        <DetailRow label="Experience" value={profile?.yearsOfExperience ? `${profile.yearsOfExperience} Years` : 'N/A'} theme={theme} styles={componentStyles} icon={Briefcase} />
                                        
                                        {(profile?.pendingLicenseNumber || profile?.licenseNumber) && (
                                            <>
                                                <DetailRow 
                                                    label="License Number" 
                                                    value={`${profile.pendingLicenseNumber || profile.licenseNumber}${profile.pendingLicenseNumber ? ' (Pending)' : ''}`} 
                                                    theme={theme} 
                                                    styles={componentStyles} 
                                                    icon={Shield} 
                                                />
                                                <DetailRow 
                                                    label="Licensing Authority" 
                                                    value={profile.pendingLicensingAuthority || profile.licensingAuthority || 'N/A'} 
                                                    theme={theme} 
                                                    styles={componentStyles} 
                                                    icon={Shield} 
                                                />
                                                <DetailRow 
                                                    label="License Expiry" 
                                                    value={formatDate(
                                                        profile.pendingLicenseExpiryDate || profile.licenseExpiryDate,
                                                        { year: 'numeric', month: 'long', day: 'numeric' }
                                                    )} 
                                                    theme={theme} 
                                                    styles={componentStyles} 
                                                    icon={Calendar} 
                                                />
                                            </>
                                        )}
                                    </View>
                                </ProfileSection>
                            </FadeInView>
                        )}

                        {/* Availability Section */}
                        {doctorData && (
                            <FadeInView delay={250} translateYOffset={50}>
                                <ProfileSection title="Availability">
                                    <View>
                                        <View>
                                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((dayName, index, arr) => {
                                                const a = doctorData?.availability?.find((item: any) => item.day === dayName);
                                                const isLast = index === arr.length - 1;
                                                const hasSlots = a && a.slots && a.slots.length > 0;
                                                
                                                return (
                                                    <View
                                                        key={dayName}
                                                        style={[
                                                            componentStyles.availabilityRow,
                                                            isLast && componentStyles.availabilityRowLast,
                                                            !hasSlots && { opacity: 0.7 }
                                                        ]}
                                                    >
                                                        <View style={componentStyles.dayCol}>
                                                            <Calendar size={14} color={hasSlots ? theme.palette.primary[500] : theme.text.tertiary} style={{ marginRight: 6 }} />
                                                            <Text variant="bodyMedium" weight="bold" color={hasSlots ? theme.text.primary : theme.text.secondary}>
                                                                {dayName.substring(0, 3)}
                                                            </Text>
                                                        </View>
                                                        <View style={componentStyles.slotsCol}>
                                                            <View style={componentStyles.chipContainer}>
                                                                {hasSlots ? a.slots.map((slot: any, idx: number) => (
                                                                    <View key={idx} style={componentStyles.chip}>
                                                                        <Clock size={14} color={theme.palette.primary[500]} style={{ marginRight: 6 }} />
                                                                        <Text variant="caption" weight="medium" color={theme.text.secondary}>
                                                                            {slot.startTime} - {slot.endTime}
                                                                        </Text>
                                                                    </View>
                                                                )) : (
                                                                    <View style={[componentStyles.chip, { backgroundColor: theme.status?.errorBg || '#fee2e2' + '20', borderColor: 'transparent', paddingVertical: 4, paddingHorizontal: 10 }]}>
                                                                        <Text variant="caption" weight="medium" color={theme.status?.error || '#ef4444'}>
                                                                            Closed
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
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
                                    showDivider={false}
                                />
                            </ProfileSection>
                        </FadeInView>

                    </View>
                </Animated.ScrollView>
            </ImageBackground>
        </View >
    );
};

export default ProfileScreen;
