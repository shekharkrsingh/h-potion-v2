import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    View,
    Animated,
    TouchableOpacity,
    Modal,
    StatusBar,
    ImageBackground,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, X } from 'lucide-react-native';
import { useToast } from '@/context/ToastContext';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    selectProfile,
    updateProfile,
    updateProfilePicture,
    updateCoverPicture
} from '@/store/slices/profileSlice';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { pickImage } from '@/utils/imagePicker';
import { formatPhoneNumber } from '@/utils/formatters';

// Modular Components
import { EditImageHeader } from '@/components/profile/edit/EditImageHeader';
import { EditSectionCard } from '@/components/profile/edit/EditSectionCard';
import { ProfileCompletionTracker } from '@/components/profile/edit/ProfileCompletionTracker';
import { EditProfileSkeletons } from '@/components/profile/edit/EditProfileSkeletons';
import { SimpleFormModal } from '@/components/profile/edit/modals/SimpleFormModal';
import { AvailabilityModal } from '@/components/profile/edit/modals/AvailabilityModal';
import { CredentialModal } from '@/components/profile/edit/modals/CredentialModal';
import { LocationModal } from '@/components/profile/edit/modals/LocationModal';
import { ClinicModal } from '@/components/profile/edit/modals/ClinicModal';
import { ImagePreviewModal } from '@/components/profile/edit/modals/ImagePreviewModal';
import { BaseEditModal } from '@/components/profile/edit/modals/BaseEditModal';
import { MedicalVerificationModal } from '@/components/profile/edit/modals/MedicalVerificationModal';


// Styles
import { createEditProfileStyles } from '@/styles/screens/profile/EditProfile.styles';

// Icons
import {
    User,
    Phone,
    FileText,
    BookOpen,
    Activity,
    Briefcase,
    MapPin,
    Calendar,
    Award,
    Building2,
    Shield
} from 'lucide-react-native';

// Local formatters removed in favor of shared utils

const EditProfileScreen = () => {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { showToast } = useToast();
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfile);
    const { user } = useAppSelector((state) => state.auth);
    const profileRole = useAppSelector((state) => state.profile.role);
    const isCollaborator = (profileRole || user?.role) === 'COLLABORATOR';

    const styles = useMemo(() => createEditProfileStyles(theme), [theme]);

    // Local State
    const [formData, setFormData] = useState<any>(() => {
        if (!profile) return null;
        return {
            ...profile,
            phoneNumber: formatPhoneNumber(profile.phoneNumber || ''),
            availability: profile.availability || [],
            education: Array.isArray(profile.education) ? profile.education : [],
            awards: Array.isArray(profile.achievementsAndAwards) ? profile.achievementsAndAwards : [],
            licenseNumber: profile.pendingLicenseNumber || profile.licenseNumber || '',
            licensingAuthority: profile.pendingLicensingAuthority || profile.licensingAuthority || '',
            licenseExpiryDate: profile.pendingLicenseExpiryDate || profile.licenseExpiryDate || '',
        };
    });
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Image Preview State
    const [previewImage, setPreviewImage] = useState<{ uri: string, type: 'profile' | 'cover', fileName: string, mimeType: string } | null>(null);

    // Animation State
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);

    // Sync profile data to local state if it changes externally
    useEffect(() => {
        if (profile && !formData) {
            setFormData({
                ...profile,
                phoneNumber: formatPhoneNumber(profile.phoneNumber || ''),
                availability: profile.availability || [],
                education: Array.isArray(profile.education) ? profile.education : [],
                awards: Array.isArray(profile.achievementsAndAwards) ? profile.achievementsAndAwards : [],
                licenseNumber: profile.pendingLicenseNumber || profile.licenseNumber || '',
                licensingAuthority: profile.pendingLicensingAuthority || profile.licensingAuthority || '',
                licenseExpiryDate: profile.pendingLicenseExpiryDate || profile.licenseExpiryDate || '',
            });
        }
    }, [profile, formData]);

    useEffect(() => {
        const task = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(task);
    }, []);

    // Header interpolations
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 60],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    const headerScale = scrollY.interpolate({
        inputRange: [-50, 0, 100],
        outputRange: [1.1, 1, 0.9],
        extrapolate: 'clamp'
    });



    const handleBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    }, [router]);

    const handleUpdate = useCallback(async (payload: any, successMessage?: string) => {
        setLoading(true);
        try {
            await dispatch(updateProfile(payload)).unwrap();
            showToast(successMessage || 'Profile updated successfully', 'success');
            setActiveModal(null);
        } catch (err: any) {
            showToast(err.message || 'Update Failed', 'error');
        } finally {
            setLoading(false);
        }
    }, [dispatch, showToast]);

    const handleImageUpdate = useCallback((type: 'profile' | 'cover') => {
        pickImage(type === 'profile' ? [1, 1] : [16, 9]).then((result) => {
            if (result) {
                setPreviewImage({
                    uri: result.uri,
                    type: type,
                    fileName: result.fileName || `${type}.jpg`,
                    mimeType: result.type || 'image/jpeg'
                });
            }
        }).catch((err: any) => {
            showToast(err.message || 'Pick Failed', 'error');
        });
    }, [showToast]);

    const handleConfirmUpload = useCallback(async () => {
        if (!previewImage) return;
        setLoading(true);
        try {
            const uploadAction = previewImage.type === 'profile'
                ? updateProfilePicture
                : updateCoverPicture;

            await dispatch(uploadAction({
                uri: previewImage.uri,
                fileName: previewImage.fileName,
                type: previewImage.mimeType
            })).unwrap();

            showToast(`${previewImage.type === 'profile' ? 'Profile' : 'Cover'} updated`, 'success');
            setPreviewImage(null);
        } catch (err: any) {
            showToast(err.message || 'Upload Failed', 'error');
        } finally {
            setLoading(false);
        }
    }, [dispatch, showToast, previewImage]);

    const handleCloseModal = useCallback(() => setActiveModal(null), []);

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    if (!isReady || !formData) return <EditProfileSkeletons />;

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={isDark
                    ? require('@assets/docbgdark.jpg')
                    : require('@assets/docbglight.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />


                {/* Animated Glass Header */}
                <Animated.View
                    pointerEvents="box-none"
                    style={[
                        styles.header,
                        {
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                            opacity: headerOpacity,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.border.subtle,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 10,
                            paddingTop: insets.top,
                        }
                    ]}
                >
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <ChevronLeft size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                    <Animated.Text style={[
                        styles.headerTitle,
                        {
                            color: theme.text.primary,
                            transform: [{ scale: headerScale }]
                        }
                    ]}>Edit Profile</Animated.Text>
                    <View style={styles.placeholderIcon} />
                </Animated.View>

                <Animated.ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                >
                    <EditImageHeader
                        profileUri={profile?.profilePicture}
                        coverUri={profile?.coverPicture}
                        onEditProfile={() => handleImageUpdate('profile')}
                        onEditCover={() => handleImageUpdate('cover')}
                        scrollY={scrollY}
                    />

                    <ProfileCompletionTracker profile={profile} isCollaborator={isCollaborator} />

                    <EditSectionCard
                        index={0}
                        title={isCollaborator ? "Name" : "Name & Bio"}
                        subtitle={isCollaborator ? `${profile?.firstName} ${profile?.lastName}` : profile?.bio}
                        icon={User}
                        isFilled={!!(profile?.firstName && (isCollaborator || profile?.bio))}
                        onPress={() => setActiveModal('personal')}
                    />

                    {!isCollaborator && (
                        <EditSectionCard
                            index={1}
                            title="Contact Info"
                            subtitle={formatPhoneNumber(profile?.phoneNumber) || 'N/A'}
                            icon={Phone}
                            isFilled={!!profile?.phoneNumber}
                            onPress={() => setActiveModal('contact')}
                        />
                    )}

                    {!isCollaborator && (
                        <EditSectionCard
                            index={2}
                            title="About Me"
                            subtitle={profile?.about}
                            icon={FileText}
                            isFilled={!!profile?.about}
                            onPress={() => setActiveModal('about')}
                        />
                    )}

                    {!isCollaborator && (
                        <>
                            <Text style={styles.categoryTitle}>Professional & Clinic</Text>
                            <EditSectionCard
                                index={3}
                                title="Specialization"
                                subtitle={profile?.specialization}
                                icon={Activity}
                                isFilled={!!profile?.specialization}
                                onPress={() => setActiveModal('specialization')}
                            />
                            <EditSectionCard
                                index={4}
                                title="Experience"
                                subtitle={profile?.yearsOfExperience ? `${profile.yearsOfExperience} Years` : undefined}
                                icon={Briefcase}
                                isFilled={!!profile?.yearsOfExperience}
                                onPress={() => setActiveModal('experience')}
                            />
                            <EditSectionCard
                                index={5}
                                title="Clinic Details"
                                subtitle={profile?.clinicName}
                                icon={Building2}
                                isFilled={!!profile?.clinicName}
                                onPress={() => setActiveModal('clinic')}
                            />
                        </>
                    )}

                    {!isCollaborator && (
                        <>
                            <Text style={styles.categoryTitle}>Practice & Location</Text>
                            <EditSectionCard
                                index={6}
                                title="Address"
                                subtitle={[
                                    profile?.address?.street,
                                    profile?.address?.city,
                                    profile?.address?.state,
                                    profile?.address?.country,
                                    profile?.address?.pincode
                                ].filter(Boolean).join(', ') || 'N/A'}
                                icon={MapPin}
                                isFilled={!!profile?.address?.city}
                                onPress={() => setActiveModal('address')}
                            />
                            <EditSectionCard
                                index={7}
                                title="Availability"
                                subtitle={profile?.availability?.map((a: any) => a.day).join(', ')}
                                icon={Calendar}
                                isFilled={!!(profile?.availability?.length)}
                                onPress={() => setActiveModal('availability')}
                            />
                        </>
                    )}

                    {!isCollaborator && (
                        <>
                            <Text style={styles.categoryTitle}>Credentials</Text>
                            <EditSectionCard
                                index={8}
                                title="Education"
                                subtitle={profile?.education?.[0]}
                                icon={BookOpen}
                                isFilled={!!(profile?.education?.length)}
                                onPress={() => setActiveModal('education')}
                            />
                            <EditSectionCard
                                index={9}
                                title="Awards & Achievements"
                                subtitle={profile?.achievementsAndAwards?.[0]}
                                icon={Award}
                                isFilled={!!(profile?.achievementsAndAwards?.length)}
                                onPress={() => setActiveModal('awards')}
                            />
                            <EditSectionCard
                                index={10}
                                title="Medical Verification"
                                subtitle={
                                    profile?.hasPendingVerification
                                        ? `${profile.pendingLicenseNumber || profile.licenseNumber || 'New'} (Pending Review)`
                                        : profile?.licenseNumber
                                            ? `${profile.licenseNumber} (${profile.verificationStatus || 'PENDING'})`
                                            : 'Not submitted'
                                }
                                icon={Shield}
                                isFilled={!!(profile?.licenseNumber || profile?.pendingLicenseNumber)}
                                onPress={() => setActiveModal('verification')}
                            />
                        </>
                    )}
                </Animated.ScrollView>

                <BaseEditModal
                    visible={!!activeModal}
                    title={`Edit ${activeModal?.charAt(0).toUpperCase()}${activeModal?.slice(1).replace(/([A-Z])/g, ' $1')}`}
                    onClose={handleCloseModal}
                >
                    {activeModal === 'personal' && (
                        <SimpleFormModal
                            title="Personal Details"
                            subtitle="Update your name and bio information"
                            icon={User}
                            fields={[
                                { key: 'firstName', label: 'First Name', validate: (val: string) => val.length < 2 ? 'Too short' : null },
                                { key: 'lastName', label: 'Last Name', validate: (val: string) => val.length > 0 && val.length < 2 ? 'Too short' : null },
                                ...(!isCollaborator ? [{ key: 'bio', label: 'Short Bio', multiline: true, validate: (val: string) => val.length > 0 && (val.length > 100 ? 'Too long' : (val.length < 10 ? 'Too short' : null)) || null }] : [])
                            ]}
                            data={formData}
                            onUpdate={(key, val) => setFormData((p: any) => ({ ...p, [key]: val }))}
                            onSave={() => handleUpdate({ firstName: formData.firstName, lastName: formData.lastName, bio: formData.bio }, 'Personal details updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'contact' && (
                        <SimpleFormModal
                            title="Contact Details"
                            subtitle="Ensure patients can reach you"
                            icon={Phone}
                            fields={[
                                {
                                    key: 'phoneNumber',
                                    label: 'Phone Number',
                                    keyboardType: 'phone-pad',
                                    maxLength: 14,
                                    validate: (val) => val.length === 14 ? null : 'Enter valid 10-digit number'
                                }
                            ]}
                            data={formData}
                            onUpdate={(key, val) => {
                                if (key === 'phoneNumber') {
                                    setFormData((p: any) => ({ ...p, [key]: formatPhoneNumber(val) }));
                                } else {
                                    setFormData((p: any) => ({ ...p, [key]: val }));
                                }
                            }}
                            onSave={() => handleUpdate({ phoneNumber: formData.phoneNumber?.replace(/\D/g, '') }, 'Contact details updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'about' && (
                        <SimpleFormModal
                            title="About Me"
                            subtitle="Tell users about your journey"
                            icon={FileText}
                            fields={[{ key: 'about', label: 'About', multiline: true }]}
                            data={formData}
                            onUpdate={(key, val) => setFormData((p: any) => ({ ...p, [key]: val }))}
                            onSave={() => handleUpdate({ about: formData.about }, 'About section updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'specialization' && (
                        <SimpleFormModal
                            title="Specialization"
                            subtitle="Define your primary field"
                            icon={Activity}
                            fields={[{ key: 'specialization', label: 'Specialization', validate: (val) => val.length < 3 ? 'Enter full specialization' : null }]}
                            data={formData}
                            onUpdate={(key, val) => setFormData((p: any) => ({ ...p, [key]: val }))}
                            onSave={() => handleUpdate({ specialization: formData.specialization }, 'Specialization updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'experience' && (
                        <SimpleFormModal
                            title="Experience"
                            subtitle="Years of clinical practice"
                            icon={Briefcase}
                            fields={[{ key: 'yearsOfExperience', label: 'Years of Experience', keyboardType: 'numeric' }]}
                            data={formData}
                            onUpdate={(key, val) => setFormData((p: any) => ({ ...p, [key]: val }))}
                            onSave={() => handleUpdate({ yearsOfExperience: parseInt(formData.yearsOfExperience) || 0 }, 'Experience details updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'clinic' && (
                        <ClinicModal
                            data={formData}
                            onUpdate={(updates) => setFormData((p: any) => ({ ...p, ...updates }))}
                            onSave={() => handleUpdate({
                                clinicName: formData.clinicName,
                                clinicEmail: formData.clinicEmail,
                                clinicContactNumber: formData.clinicContactNumber,
                                clinicAddress: formData.clinicAddress,
                                consultationFee: formData.consultationFee
                            }, 'Clinic details updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'address' && (
                        <LocationModal
                            address={formData.address || {}}
                            onUpdate={(updates) => setFormData((p: any) => ({ ...p, address: { ...p.address, ...updates } }))}
                            onSave={() => handleUpdate({ address: formData.address }, 'Address updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'availability' && (
                        <AvailabilityModal
                            availability={formData.availability}
                            onUpdateAvailability={(availability) => setFormData((p: any) => ({ ...p, availability }))}
                            onSave={() => handleUpdate({ availability: formData.availability }, 'Availability updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'education' && (
                        <CredentialModal
                            type="education"
                            items={formData.education}
                            onUpdateItems={(items) => setFormData((p: any) => ({ ...p, education: items }))}
                            onSave={() => handleUpdate({ education: formData.education }, 'Education details updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'awards' && (
                        <CredentialModal
                            type="awards"
                            items={formData.awards}
                            onUpdateItems={(items) => setFormData((p: any) => ({ ...p, awards: items }))}
                            onSave={() => handleUpdate({ achievementsAndAwards: formData.awards }, 'Awards & Achievements updated')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}

                    {activeModal === 'verification' && (
                        <MedicalVerificationModal
                            data={formData}
                            onUpdate={(updates) => setFormData((p: any) => ({ ...p, ...updates }))}
                            onSave={() => handleUpdate({
                                licenseNumber: formData.licenseNumber,
                                licensingAuthority: formData.licensingAuthority,
                                licenseExpiryDate: formData.licenseExpiryDate
                            }, 'Verification details submitted')}
                            onClose={handleCloseModal}
                            loading={loading}
                        />
                    )}
                </BaseEditModal>

                <ImagePreviewModal
                    visible={!!previewImage}
                    imageUri={previewImage?.uri || null}
                    type={previewImage?.type || 'profile'}
                    onConfirm={handleConfirmUpload}
                    onCancel={() => setPreviewImage(null)}
                    loading={loading}
                />
            </ImageBackground>
        </SafeAreaView>
    );
};

export default EditProfileScreen;
