import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Animated, Easing, Alert, Modal, ImageBackground } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import {
    ChevronLeft, Lock, Mail, Bell, Shield, Headphones,
    LogOut, UserX, Trash2, Calendar, Users, Activity, AlertOctagon,
    ArrowRight, FileStack, Contact
} from 'lucide-react-native';

import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/context/ToastContext';

import { haptics } from '@/utils/haptics';
import { logoutUser } from '@/store/slices/authSlice';
import { toggleHaptics, toggleNotificationsVibration, toggleEmergencyAlerts } from '@/store/slices/userSettingsSlice';
import { RootState } from '@/store';

// Modular Components
import { ToggleRow } from '@/components/settings/ToggleRow';
import { SettingCard } from '@/components/settings/SettingCard';
import { ProfileSummaryHeader } from '@/components/settings/ProfileSummaryHeader';
import { SettingsSkeleton } from '@/components/settings/SettingsSkeleton';
import { PasswordModal } from '@/components/settings/modals/PasswordModal';
import { EmailModal } from '@/components/settings/modals/EmailModal';
import { PrivacyModal } from '@/components/settings/modals/PrivacyModal';
import { SupportModal } from '@/components/settings/modals/SupportModal';
import { BaseEditModal } from '@/components/profile/edit/modals/BaseEditModal';

// Styles
import { createSettingsStyles } from '@/styles/screens/SettingsScreen.styles';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';

export default function SettingsScreen() {
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { showToast } = useToast();


    // Redux State
    const { user } = useSelector((state: RootState) => state.auth);
    const profile = useSelector((state: RootState) => state.profile.data);
    const profileRole = useSelector((state: RootState) => state.profile.role);
    const isProfileLoading = useSelector((state: RootState) => state.profile.isLoading);
    const { hapticsEnabled, notificationsVibrationEnabled, emergencyAlertsEnabled } = useSelector((state: RootState) => state.userSettings);

    // Derived Styles & State
    const styles = useMemo(() => createSettingsStyles(theme, insets, isDark), [theme, insets, isDark]);
    const componentStyles = useMemo(() => createEditComponentStyles(theme), [theme]);
    const params = useLocalSearchParams();
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);

    // Permissions
    const isCollaborator = (profileRole || user?.role) === 'COLLABORATOR';

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnims = useRef([...Array(15)].map(() => new Animated.Value(20))).current;

    useEffect(() => {
        if (!isProfileLoading) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.stagger(40, slideAnims.map(anim =>
                    Animated.timing(anim, { toValue: 0, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true })
                ))
            ]).start();
        }
    }, [isProfileLoading]);

    // Header Calculations
    const headerOpacity = scrollY.interpolate({ inputRange: [0, 60], outputRange: [0, 1], extrapolate: 'clamp' });
    const headerScale = scrollY.interpolate({ inputRange: [-50, 0, 100], outputRange: [1.05, 1, 0.95], extrapolate: 'clamp' });

    useFocusEffect(
        useCallback(() => {
            if (params.reset === 'true') {
                scrollViewRef.current?.scrollTo({ y: 0, animated: false });
                router.setParams({ reset: 'false' });
            }
        }, [params.reset])
    );

    // Action Handlers
    const handleBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    }, [router]);

    const handleSignOut = useCallback(() => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    await dispatch(logoutUser());
                    showToast("Signed out successfully", "success");
                    router.replace('/(auth)/login');
                }
            }
        ]);
    }, [dispatch, router, showToast]);

    const handleToggle = (name: string, value: boolean, action: any) => {
        dispatch(action(value));
        showToast(`${name} ${value ? 'Enabled' : 'Disabled'}`, 'info');
        if (value) haptics.selection();
    };

    if (isProfileLoading) return <SettingsSkeleton theme={theme} />;

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDark ? require('@assets/docbgdark.jpg') : require('@assets/docbglight.jpg')}
                style={styles.background}
                resizeMode="cover"
            >

                {/* Sticky Production Header */}
                <Animated.View style={[styles.header, { opacity: headerOpacity, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, paddingTop: insets.top }]}>
                    <View style={[styles.headerContent, { marginTop: 0 }]}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}><ChevronLeft size={24} color={theme.text.primary} /></TouchableOpacity>
                        <Animated.Text style={[styles.headerTitle, { transform: [{ scale: headerScale }] }]}>Settings</Animated.Text>
                        <View style={{ width: 40 }} />
                    </View>
                </Animated.View>

                {/* Static Content Header */}
                <View style={[styles.header, { zIndex: 1, paddingTop: insets.top }]}>
                    <View style={[styles.headerContent, { borderBottomWidth: 0, marginTop: 0 }]}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}><ChevronLeft size={24} color={theme.text.primary} /></TouchableOpacity>
                        <Text variant="h3" weight="bold" color={theme.text.primary} style={styles.headerTitle}>Settings</Text>
                        <View style={{ width: 40 }} />
                    </View>
                </View>

                <Animated.ScrollView
                    ref={scrollViewRef}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                    scrollEventThrottle={16}
                >
                    <ProfileSummaryHeader profile={profile} theme={theme} isDark={isDark} styles={styles} />

                    <Text style={styles.sectionLabel}>Account Security</Text>
                    <SettingCard index={0} icon={Lock} title="Password" subtitle="Change login credentials" onPress={() => setActiveModal('password')} theme={theme} componentStyles={componentStyles} />
                    <SettingCard index={1} icon={Mail} title="Email Address" subtitle={profile?.email || 'Update your email'} isFilled={!!profile?.email} onPress={() => setActiveModal('email')} theme={theme} componentStyles={componentStyles} />

                    {!isCollaborator && (
                        <>
                            <Text style={styles.sectionLabel}>Clinical Collaboration</Text>
                            <SettingCard index={2} icon={Users} title="My Team" subtitle="Manage clinic members" onPress={() => router.push('/team')} theme={theme} componentStyles={componentStyles} />
                            <SettingCard index={3} icon={Calendar} title="Availability" subtitle="Working hours & holidays" onPress={() => router.push('/profile/edit')} theme={theme} componentStyles={componentStyles} />

                            <Text style={styles.sectionLabel}>Clinic Resources</Text>
                            <SettingCard index={4} icon={FileStack} title="Medical Reports" subtitle="View patient diagnostic reports" onPress={() => router.push('/resources/reports')} theme={theme} componentStyles={componentStyles} />
                            <SettingCard index={5} icon={Contact} title="My Doctor Card" subtitle="Share your professional profile" onPress={() => router.push('/resources/doctor-card')} theme={theme} componentStyles={componentStyles} />
                        </>
                    )}

                    <Text style={styles.sectionLabel}>Vibration & Haptics</Text>
                    <Animated.View style={[componentStyles.sectionCard, { padding: 16, opacity: fadeAnim, transform: [{ translateY: slideAnims[4] }] }]}>
                        <ToggleRow icon={Activity} color={theme.palette.primary[400]} label="Interaction Haptics" description="Feedback for taps and gestures" value={hapticsEnabled} onValueChange={v => handleToggle('Haptics', v, toggleHaptics)} theme={theme} />
                        <View style={styles.divider} />
                        <ToggleRow icon={Bell} color={theme.palette.secondary[400]} label="Messaging Vibration" description="Vibration for new messages" value={notificationsVibrationEnabled} onValueChange={v => handleToggle('Vibration', v, toggleNotificationsVibration)} theme={theme} />
                        <View style={styles.divider} />
                        <ToggleRow icon={AlertOctagon} color={theme.status.error} label="Emergency Alerts" description="Bypass silent for appointments" value={emergencyAlertsEnabled} onValueChange={v => handleToggle('Emergency Alerts', v, toggleEmergencyAlerts)} theme={theme} />
                    </Animated.View>

                    <Text style={styles.sectionLabel}>Notification Settings</Text>
                    <SettingCard index={5} icon={Bell} title="Preferences" subtitle="Email & Push notifications" onPress={() => setActiveModal('notifications')} theme={theme} componentStyles={componentStyles} />

                    {!isCollaborator && (
                        <>
                            <Text style={styles.sectionLabel}>Privacy & Policy</Text>
                            <SettingCard index={6} icon={Shield} title="Privacy Settings" subtitle="Control profile visibility" onPress={() => setActiveModal('privacy')} theme={theme} componentStyles={componentStyles} />
                        </>
                    )}

                    <Text style={styles.sectionLabel}>Help & Support</Text>
                    <SettingCard index={7} icon={Headphones} title="Contact Support" subtitle="Get technical assistance" onPress={() => setActiveModal('support')} theme={theme} componentStyles={componentStyles} />

                    <Text style={styles.sectionLabel}>Danger Zone</Text>
                    <Animated.View style={[componentStyles.sectionCard, { padding: 16, opacity: fadeAnim, transform: [{ translateY: slideAnims[8] }] }]}>
                        {/* Sign Out Button */}
                        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
                            <LogOut size={20} color={theme.status.error} />
                            <Text weight="bold" color={theme.status.error} style={styles.buttonText}>Sign Out</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => Alert.alert("Deactivate", "Feature coming soon.")} style={styles.signOutButton}>
                            <UserX size={20} color={theme.status.error} />
                            <Text weight="bold" color={theme.status.error} style={styles.buttonText}>Deactivate Account</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        {/* Delete Data Zone - Hidden for Collaborators */}
                        {!isCollaborator && (
                            <TouchableOpacity
                                onPress={() => Alert.alert("Delete Data", "Are you sure? This action cannot be undone.", [{ text: "Cancel" }, { text: "Delete", style: "destructive" }])}
                                style={styles.deleteDataButton}
                            >
                                <Trash2 size={20} color={theme.status.error} />
                                <Text weight="bold" color={theme.status.error} style={styles.buttonText}>Delete Data</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>

                    <View style={styles.footer}>
                        <Text style={styles.versionText}>H-Potion for Doctors • Version 2.0.1</Text>
                        <View style={styles.legalLinks}>
                            <TouchableOpacity onPress={() => router.push('/legal/terms')}><Text style={styles.legalLink}>Terms</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push('/legal/privacy')}><Text style={styles.legalLink}>Privacy</Text></TouchableOpacity>
                        </View>
                    </View>
                </Animated.ScrollView>

                {/* Modal Components */}
                <PasswordModal visible={activeModal === 'password'} onClose={() => setActiveModal(null)} theme={theme} />
                <EmailModal visible={activeModal === 'email'} onClose={() => setActiveModal(null)} currentEmail={profile?.email || ''} theme={theme} />
                <PrivacyModal visible={activeModal === 'privacy'} onClose={() => setActiveModal(null)} theme={theme} />
                <SupportModal visible={activeModal === 'support'} onClose={() => setActiveModal(null)} theme={theme} />

                {/* Notification Preferences Modal - Stub for now as logic involves more slices */}
                <BaseEditModal visible={activeModal === 'notifications'} title="Notification Preferences" onClose={() => setActiveModal(null)}>
                    <View style={styles.modalContent}>
                        <ToggleRow icon={Mail} color={theme.palette.primary[400]} label="Email Notifications" description="Receive updates via email" value={true} onValueChange={() => { }} theme={theme} />
                        <View style={styles.divider} />
                        <ToggleRow icon={Bell} color={theme.palette.secondary[400]} label="Push Notifications" description="Receive instant mobile alerts" value={true} onValueChange={() => { }} theme={theme} />
                    </View>
                </BaseEditModal>
            </ImageBackground>
        </View>
    );
}
