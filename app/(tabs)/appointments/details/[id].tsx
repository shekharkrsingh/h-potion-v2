import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { View, TouchableOpacity, Alert, Animated, ImageBackground, Platform, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MoreVertical, AlertCircle, Zap, Building2, Video, DollarSign, MapPin, FileText } from 'lucide-react-native';

import { AppDispatch, RootState } from '@/store';
import {
    updateAppointment,
    updateEmergencyStatus,
    cancelAppointment,
} from '@/store/slices/appointmentSlice';
import {
    getAppointmentDetails,
    clearSelectedAppointment
} from '@/store/slices/appointmentDetailsSlice';
import { useTheme } from '@/theme/ThemeContext';
import { createStyles } from '@/styles/screens/AppointmentDetails.styles';
import { Text } from '@/components/ui/Text';
import { FadeInView } from '@/components/ui/FadeInView';

// Modular Components
import { PatientAvatar } from '@/components/appointments/PatientAvatar';
import { AppointmentActionPanel } from '@/components/appointments/AppointmentActionPanel';
import { EditAppointmentForm } from '@/components/appointments/EditAppointmentForm';
import { AppointmentDetailsSkeleton } from '@/components/appointments/AppointmentDetailsSkeleton';
import { PatientInfoCard } from '@/components/appointments/details/PatientInfoCard';
import { DoctorInfoCard } from '@/components/appointments/details/DoctorInfoCard';
import { TimelineCard } from '@/components/appointments/details/TimelineCard';
import { StatusBadge } from '@/components/appointments/details/StatusBadge';

export default function AppointmentDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch<AppDispatch>();

    const { theme, isDark } = useTheme();
    // Using simple keys from styles, assuming createStyles provides them. 
    // Ideally createStyles handles layout. The components handle their inner styles.
    const styles = useMemo(() => createStyles(theme), [theme]);

    // Native Animated Value
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 40],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: ['transparent', isDark ? theme.background.card : theme.background.default],
        extrapolate: 'clamp',
    });

    const headerBorderWidth = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // Get appointment from store
    const appointment = useSelector((state: RootState) => state.appointmentDetails.selectedAppointment);
    const { isLoading, error } = useSelector((state: RootState) => state.appointmentDetails);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(getAppointmentDetails(id as string));
        }
        return () => {
            dispatch(clearSelectedAppointment());
        };
    }, [id, dispatch]);

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    const handleBack = useCallback(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)/dashboard');
        }
    }, [router]);

    // Dynamic Refresh
    const onRefresh = useCallback(async () => {
        if (!id) return;
        setRefreshing(true);
        await dispatch(getAppointmentDetails(id as string));
        setRefreshing(false);
    }, [id, dispatch]);

    // Retrying fetch on error
    const handleRetry = useCallback(() => {
        if (id) dispatch(getAppointmentDetails(id as string));
    }, [id, dispatch]);

    // --- Actions ---
    const handleUpdate = useCallback(async (data: any) => {
        if (!appointment) return;
        try {
            await dispatch(updateAppointment({ id: appointment.appointmentId, data })).unwrap();
        } catch (err: any) {
            Alert.alert('Update Failed', err.message);
        }
    }, [appointment, dispatch]);

    const handleCancel = useCallback(async () => {
        if (!appointment) return;
        try {
            await dispatch(cancelAppointment(appointment.appointmentId)).unwrap();
            handleBack();
        } catch (e: any) {
            Alert.alert('Error', e.message);
        }
    }, [appointment, dispatch, router]);

    const handleEditSave = useCallback(async (updates: any) => {
        await handleUpdate(updates);
        setIsEditModalVisible(false);
    }, [handleUpdate]);

    // --- Smart Action Logic ---
    const smartAction = useMemo(() => {
        if (!appointment) return null;
        if (appointment.status === 'CANCELLED') return null;

        if (!appointment.paymentStatus) {
            return {
                label: 'Collect Payment',
                icon: DollarSign,
                color: theme.status.success,
                textColor: '#FFFFFF',
                action: () => handleUpdate({ paymentStatus: true })
            };
        }
        if (!appointment.availableAtClinic) {
            return {
                label: 'Mark Arrived',
                icon: MapPin,
                color: theme.palette.secondary[500],
                textColor: '#FFFFFF',
                action: () => handleUpdate({ availableAtClinic: true, availableAtClinicDateTime: new Date().toISOString() })
            };
        }
        if (!appointment.treated) {
            return {
                label: 'Mark Treated',
                icon: FileText,
                color: theme.palette.primary[600],
                textColor: '#FFFFFF',
                action: () => handleUpdate({ treated: true })
            };
        }
        return null;
    }, [appointment, theme, handleUpdate]);

    if (isLoading && !appointment) {
        return (
            <View style={styles.container}>
                <View style={[styles.header, { marginTop: insets.top }]}>
                    <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                        <ChevronLeft size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                </View>
                <AppointmentDetailsSkeleton />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <View style={[styles.header, { marginTop: insets.top, position: 'absolute', top: 0, left: 0 }]}>
                    <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                        <ChevronLeft size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                </View>
                <AlertCircle size={48} color={theme.status.error} style={styles.errorIcon} />
                <Text style={styles.errorTitle}>Failed to load</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!appointment) {
        return (
            <View style={styles.centerContainer}>
                <View style={[styles.header, { marginTop: insets.top, position: 'absolute', top: 0, left: 0 }]}>
                    <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                        <ChevronLeft size={24} color={theme.text.primary} />
                    </TouchableOpacity>
                </View>
                <AlertCircle size={48} color={theme.text.tertiary} style={styles.errorIcon} />
                <Text style={styles.errorTitle}>Not Found</Text>
                <Text style={styles.errorText}>Appointment details could not be found.</Text>
            </View>
        );
    }

    const headerHeight = Platform.OS === 'android' ? 90 : 110;

    return (
        <View style={styles.container}>
            {/* Background Image (Static) */}
            <ImageBackground
                source={isDark ? require('@assets/docbgdark.jpg') : require('@assets/docbglight.jpg')}
                style={[styles.backgroundImage, { position: 'absolute', width: '100%', height: '100%' }]}
                resizeMode="cover"
            />

            {/* Sticky Header */}
            <Animated.View style={[
                styles.header,
                {
                    position: 'absolute', top: 0, left: 0, right: 0,
                    backgroundColor: headerBackgroundColor,
                    borderBottomWidth: headerBorderWidth,
                    borderBottomColor: theme.border.subtle,
                    paddingTop: insets.top,
                    height: headerHeight,
                    zIndex: 10
                }
            ]}>
                <TouchableOpacity onPress={handleBack} style={[styles.iconButton, { marginTop: 10 }]}>
                    <ChevronLeft size={24} color={theme.text.primary} />
                </TouchableOpacity>
                <Animated.View style={{ opacity: headerOpacity, marginTop: 10 }}>
                    <Text style={styles.headerTitle}>Details</Text>
                </Animated.View>
                <TouchableOpacity style={[styles.iconButton, { marginTop: 10 }]} onPress={() => setIsEditModalVisible(true)}>
                    <MoreVertical size={24} color={theme.text.primary} />
                </TouchableOpacity>
            </Animated.View>

            {/* Scroll Content */}
            <Animated.ScrollView
                ref={scrollViewRef}
                onScroll={onScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
                contentContainerStyle={[styles.contentContainer, { paddingTop: headerHeight + 20 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.palette.primary[500]}
                        colors={[theme.palette.primary[500]]}
                        progressViewOffset={headerHeight}
                    />
                }
            >
                {/* Hero Section */}
                <FadeInView delay={0}>
                    <View style={styles.heroSection}>
                        <View style={styles.heroAvatarContainer}>
                            <PatientAvatar
                                name={appointment.patientName}
                                size={100}
                                variant={appointment.isEmergency ? 'emergency' : 'default'}
                                containerStyle={{ borderWidth: 4, borderColor: theme.palette.neutral[0] }}
                            />
                        </View>
                        <Text style={styles.patientName} numberOfLines={1} adjustsFontSizeToFit>{appointment.patientName}</Text>
                        <Text style={styles.patientId}>ID: {appointment.appointmentId}</Text>

                        <View style={styles.statusRow}>
                            <StatusBadge
                                label={appointment.status}
                                color={appointment.status === 'ACCEPTED' ? theme.status.success : appointment.status === 'CANCELLED' ? theme.status.error : theme.palette.secondary[600]}
                            />
                            <StatusBadge
                                label={appointment.appointmentType === 'ONLINE' ? 'Online' : 'In-Person'}
                                color={theme.palette.primary[600]}
                                icon={appointment.appointmentType === 'ONLINE' ? <Video size={14} color={theme.palette.primary[600]} /> : <Building2 size={14} color={theme.palette.primary[600]} />}
                            />
                            {appointment.isEmergency && (
                                <StatusBadge
                                    label="Emergency"
                                    color={theme.status.error}
                                    icon={<AlertCircle size={14} color={theme.status.error} />}
                                />
                            )}
                        </View>
                    </View>
                </FadeInView>

                {/* Modular Cards */}
                <PatientInfoCard appointment={appointment} delay={100} />
                <DoctorInfoCard appointment={appointment} delay={200} />

                {/* Actions */}
                <FadeInView delay={300} style={styles.sectionCard}>
                    <View style={styles.sectionHeaderRow}>
                        <Zap size={20} color={theme.status.warning} />
                        <Text style={styles.sectionTitle}>Actions</Text>
                    </View>
                    <AppointmentActionPanel
                        appointment={appointment}
                        onEdit={() => setIsEditModalVisible(true)}
                        onToggleAvailability={(val) => handleUpdate({ availableAtClinic: val, availableAtClinicDateTime: val ? new Date().toISOString() : null })}
                        onTogglePayment={() => handleUpdate({ paymentStatus: !appointment.paymentStatus })}
                        onToggleTreated={() => handleUpdate({ treated: !appointment.treated })}
                        onToggleEmergency={() => dispatch(updateEmergencyStatus({
                            id: appointment.appointmentId,
                            isEmergency: !appointment.isEmergency
                        }))}
                        onCancel={() => handleCancel()}
                    />
                </FadeInView>

                <TimelineCard appointment={appointment} delay={400} />

            </Animated.ScrollView>

            <EditAppointmentForm
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSave={handleEditSave}
                appointment={appointment}
            />

            {/* Smart Action FAB */}
            {smartAction && (
                <FadeInView delay={600} style={styles.fabContainer}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.smartFab, { backgroundColor: smartAction.color }]}
                        onPress={() => {
                            Alert.alert(smartAction.label, 'Confirm this action?', [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Proceed', onPress: smartAction.action }
                            ]);
                        }}
                    >
                        <smartAction.icon size={20} color={smartAction.textColor} strokeWidth={3} />
                        <Text style={[styles.smartFabText, { color: smartAction.textColor }]}>{smartAction.label}</Text>
                    </TouchableOpacity>
                </FadeInView>
            )}
        </View>
    );
}
