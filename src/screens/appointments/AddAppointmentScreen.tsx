import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    RefreshControl,
    Modal,
    Animated,
    Dimensions,
    LayoutAnimation,
    Easing,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Calendar as CalendarIcon,
    Clock,
    Phone,
    Mail,
    Check,
    CreditCard,
    MapPin,
    ChevronDown,
    ChevronUp,
    FileText,
    AlertCircle,
    Zap,
    Info,
    X as XIcon,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Toast, ToastType } from '@/components/ui/Toast';
import { spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
import { radius } from '@/theme/radius';
import { AppDispatch, RootState } from '@/store';
import { bookAppointment } from '@/store/slices/bookingSlice';
import { fetchProfile } from '@/store/slices/profileSlice';
import { haptics } from '@/utils/haptics';

// Sub-components
import { AddAppointmentCard } from '@/components/add-appointment/AddAppointmentCard';
import { SelectionChip } from '@/components/add-appointment/SelectionChip';
import { DateTimeButton } from '@/components/add-appointment/DateTimeButton';
import { FadeInView } from '@/components/ui/FadeInView';

// Styles
import { createStyles } from '@/styles/screens/AddAppointmentScreen.styles';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatPhoneNumber = (digits: string) => {
    const clean = digits.replace(/\D/g, '').slice(0, 10);
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
};

const VerificationBadge = memo(({ visible, styles }: { visible: boolean; styles: any }) => {
    if (!visible) return null;
    return (
        <FadeInView delay={0} duration={300} style={styles.badgeContainer}>
            <View style={styles.verificationBadge}>
                <Check size={12} color="#FFF" strokeWidth={3} />
            </View>
        </FadeInView>
    );
});

// Summary Info Sub-components
const SummaryRow = memo(({ icon: Icon, label, value, color, theme, styles }: any) => (
    <View style={styles.summaryRow}>
        <View style={[styles.summaryIconContainer, { backgroundColor: color || theme.background.subtle }]}>
            <Icon size={20} color={color ? '#FFF' : theme.text.tertiary} />
        </View>
        <View>
            <Text variant="caption" color={theme.text.tertiary} style={styles.summaryLabel}>{label}</Text>
            <Text variant="bodyLarge" weight="bold" color={theme.text.primary}>{value}</Text>
        </View>
    </View>
));

const BookingSummaryModal = memo(({ visible, onConfirm, onCancel, data, isSubmitting, theme, isDark, styles }: any) => {
    const animValue = useRef(new Animated.Value(0)).current;
    const [innerVisible, setInnerVisible] = useState(visible);

    useEffect(() => {
        if (visible) {
            setInnerVisible(true);
            Animated.timing(animValue, {
                toValue: 1,
                duration: 400,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    setInnerVisible(false);
                }
            });
        }
    }, [visible]);

    if (!innerVisible && (animValue as any)._value === 0) return null;

    const backdropOpacity = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [600, 0],
    });

    return (
        <Modal
            visible={innerVisible}
            transparent
            statusBarTranslucent={true}
            onRequestClose={onCancel}
            animationType="none"
        >
            <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
                <TouchableOpacity
                    style={styles.backdropTouchable}
                    activeOpacity={1}
                    onPress={onCancel}
                />
                <Animated.View style={[styles.summaryContainer, { transform: [{ translateY }] }]}>
                    <ImageBackground
                        source={isDark ? require('@assets/docbgdark.jpg') : require('@assets/docbglight.jpg')}
                        style={styles.summaryContentWrapper}
                        imageStyle={styles.summaryImageStyle}
                        blurRadius={20}
                    >
                        <View style={styles.modalDragHandle} />
                        <View style={styles.summaryHeaderContainer}>
                            <Text variant="h3" weight="bold">Review Booking</Text>
                            <Text variant="bodySmall" color={theme.text.tertiary}>Please verify the details below</Text>

                            <View style={styles.summaryContent}>
                                <SummaryRow
                                    icon={AlertCircle}
                                    label="Patient"
                                    value={`${data.firstName} ${data.lastName}`.trim()}
                                    color={data.isEmergency ? '#ef4444' : undefined}
                                    theme={theme}
                                    styles={styles}
                                />
                                <SummaryRow
                                    icon={Clock}
                                    label="Schedule"
                                    value={data.appointmentDateTime.toLocaleString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    theme={theme}
                                    styles={styles}
                                />
                                <SummaryRow
                                    icon={MapPin}
                                    label="Location"
                                    value={data.availableAtClinic ? 'In-Clinic Consultation' : 'Online Appointment'}
                                    theme={theme}
                                    styles={styles}
                                />
                                {data.contact && (
                                    <SummaryRow
                                        icon={Phone}
                                        label="Contact"
                                        value={data.maskedContact}
                                        theme={theme}
                                        styles={styles}
                                    />
                                )}
                            </View>

                            <View style={styles.summaryFooter}>
                                <TouchableOpacity
                                    onPress={onConfirm}
                                    disabled={isSubmitting}
                                    activeOpacity={0.9}
                                    style={[styles.fabButton, { height: 52 }]}
                                >
                                    <LinearGradient
                                        colors={data.isEmergency ? ['#ef4444', '#b91c1c'] : ((theme as any).gradients?.primary || ['#0ea5e9', '#0284c7'])}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={[styles.gradientButton, { borderRadius: 12 }]}
                                    >
                                        {isSubmitting ? (
                                            <Text color="#FFF" weight="bold">Scheduling...</Text>
                                        ) : (
                                            <>
                                                <Text variant="bodyMedium" color="#FFF" weight="bold" style={{ marginRight: 8 }}>
                                                    Confirm & Schedule
                                                </Text>
                                                <Check size={18} color="#FFF" strokeWidth={3} />
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onCancel}
                                    disabled={isSubmitting}
                                    style={{ paddingVertical: spacing.s, alignItems: 'center' }}
                                >
                                    <Text variant="bodySmall" color={theme.text.tertiary} weight="medium">Back to editing</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
});

const AddAppointmentScreen = () => {
    const { theme, isDark } = useTheme();
    const styles = createStyles(theme, isDark);
    const dispatch = useDispatch<AppDispatch>();
    const { data: profile } = useSelector((state: RootState) => state.profile);

    // Input Refs for Navigation
    const lastRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const scrollViewRef = useRef<any>(null);

    // Initial State
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        maskedContact: '',
        email: '',
        description: '',
        gender: 'Male', // Stage 2
        ageGroup: 'Adult', // Stage 2
        paymentStatus: true,
        availableAtClinic: true,
        isEmergency: false,
        appointmentDateTime: new Date(),
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAdditional, setShowAdditional] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [showAvailabilityInfo, setShowAvailabilityInfo] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

    // Progressive Disclosure Helper
    const isBasicInfoComplete = form.firstName.trim().length > 1 && form.contact.length === 10;

    // Toast State
    const [toast, setToast] = useState<{ visible: boolean; message: string; type: ToastType }>({
        visible: false,
        message: '',
        type: 'info',
    });

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        setToast({ visible: true, message, type });
        if (type === 'success') {
            haptics.impact();
        } else if (type === 'error') {
            haptics.error();
        } else {
            haptics.selection();
        }
    }, []);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        haptics.impact();

        // Reset form
        setForm({
            firstName: '',
            lastName: '',
            contact: '',
            maskedContact: '',
            email: '',
            description: '',
            gender: 'Male',
            ageGroup: 'Adult',
            paymentStatus: true,
            availableAtClinic: true,
            isEmergency: false,
            appointmentDateTime: new Date(),
        });
        setShowAdditional(false);

        // Minimal delay for visual feedback
        setTimeout(() => {
            setRefreshing(false);
            showToast('Form cleared', 'info');
        }, 800);
    }, [showToast]);

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollToPosition(0, 0, false);
            dispatch(fetchProfile());
        }, [dispatch])
    );

    const handleReasonSelect = useCallback((reason: string) => {
        haptics.selection();
        setForm(prev => {
            const current = prev.description;
            // Split by comma and clean whitespace
            const parts = current ? current.split(',').map(p => p.trim()).filter(Boolean) : [];

            if (parts.includes(reason)) {
                // Remove if already present (Toggle off)
                const newParts = parts.filter(p => p !== reason);
                return { ...prev, description: newParts.join(', ') };
            } else {
                // Add if not present
                parts.push(reason);
                return { ...prev, description: parts.join(', ') };
            }
        });
    }, []);

    const updateForm = useCallback((key: string, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate && event.type !== 'dismissed') {
            setForm(prev => {
                const current = prev.appointmentDateTime;
                const newDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    current.getHours(),
                    current.getMinutes()
                );

                // Real-time validation
                const DAYS_MAP = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                const selectedDayName = DAYS_MAP[newDate.getDay()];
                const newErrors = { ...errors };

                if (profile?.availability && profile.availability.length > 0) {
                    const dayData = profile.availability.find(a => a.day === selectedDayName);
                    if (!dayData) {
                        const prettyDay = selectedDayName.charAt(0) + selectedDayName.slice(1).toLowerCase();
                        newErrors.appointmentDateTime = `You are not available on ${prettyDay}s. Please select an available day.`;
                        delete newErrors.appointmentTime;
                    } else {
                        delete newErrors.appointmentDateTime;

                        if (dayData.slots && dayData.slots.length > 0) {
                            const apptMinutes = newDate.getHours() * 60 + newDate.getMinutes();
                            const parseTimeToMinutes = (timeStr: string): number => {
                                const cleanStr = timeStr.trim().toLowerCase();
                                const isPm = cleanStr.includes('pm');
                                const temp = cleanStr.replace(/[^0-9:]/g, '');
                                const [hStr, mStr] = temp.split(':');
                                let hour = parseInt(hStr, 10);
                                const minute = parseInt(mStr, 10);
                                if (hour === 12) hour = 0;
                                if (isPm) hour += 12;
                                return hour * 60 + minute;
                            };

                            const isWithinSlot = dayData.slots.some((slot: any) => {
                                try {
                                    if (slot.startTime && slot.endTime) {
                                        const startMinutes = parseTimeToMinutes(slot.startTime);
                                        const endMinutes = parseTimeToMinutes(slot.endTime);
                                        return apptMinutes >= startMinutes && apptMinutes <= endMinutes;
                                    }
                                } catch { }
                                return false;
                            });

                            if (!isWithinSlot) {
                                newErrors.appointmentTime = 'Selected time is outside your configured availability slots.';
                            } else {
                                delete newErrors.appointmentTime;
                            }
                        } else {
                            newErrors.appointmentTime = `You have no time slots configured for ${selectedDayName}.`;
                        }
                    }
                }
                setErrors(newErrors);
                return { ...prev, appointmentDateTime: newDate };
            });
        }
    }, [profile, errors]);

    const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowTimePicker(false);
        if (selectedDate && event.type !== 'dismissed') {
            setForm(prev => {
                const current = prev.appointmentDateTime;
                const newDate = new Date(
                    current.getFullYear(),
                    current.getMonth(),
                    current.getDate(),
                    selectedDate.getHours(),
                    selectedDate.getMinutes()
                );

                // Real-time validation
                const DAYS_MAP = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                const selectedDayName = DAYS_MAP[newDate.getDay()];
                const newErrors = { ...errors };

                if (profile?.availability && profile.availability.length > 0) {
                    const dayData = profile.availability.find(a => a.day === selectedDayName);
                    if (!dayData) {
                        const prettyDay = selectedDayName.charAt(0) + selectedDayName.slice(1).toLowerCase();
                        newErrors.appointmentDateTime = `You are not available on ${prettyDay}s. Please select an available day.`;
                        delete newErrors.appointmentTime;
                    } else {
                        delete newErrors.appointmentDateTime;

                        if (dayData.slots && dayData.slots.length > 0) {
                            const apptMinutes = newDate.getHours() * 60 + newDate.getMinutes();
                            const parseTimeToMinutes = (timeStr: string): number => {
                                const cleanStr = timeStr.trim().toLowerCase();
                                const isPm = cleanStr.includes('pm');
                                const temp = cleanStr.replace(/[^0-9:]/g, '');
                                const [hStr, mStr] = temp.split(':');
                                let hour = parseInt(hStr, 10);
                                const minute = parseInt(mStr, 10);
                                if (hour === 12) hour = 0;
                                if (isPm) hour += 12;
                                return hour * 60 + minute;
                            };

                            const isWithinSlot = dayData.slots.some((slot: any) => {
                                try {
                                    if (slot.startTime && slot.endTime) {
                                        const startMinutes = parseTimeToMinutes(slot.startTime);
                                        const endMinutes = parseTimeToMinutes(slot.endTime);
                                        return apptMinutes >= startMinutes && apptMinutes <= endMinutes;
                                    }
                                } catch { }
                                return false;
                            });

                            if (!isWithinSlot) {
                                newErrors.appointmentTime = 'Selected time is outside your configured availability slots.';
                            } else {
                                delete newErrors.appointmentTime;
                            }
                        } else {
                            newErrors.appointmentTime = `You have no time slots configured for ${selectedDayName}.`;
                        }
                    }
                }
                setErrors(newErrors);
                return { ...prev, appointmentDateTime: newDate };
            });
        }
    }, [profile, errors]);

    const handleQuickTime = useCallback((hours: number, minutes: number = 0) => {
        haptics.selection();
        setForm(prev => {
            const newDate = new Date();
            newDate.setHours(newDate.getHours() + hours);
            newDate.setMinutes(newDate.getMinutes() + minutes);
            return { ...prev, appointmentDateTime: newDate };
        });
        const msg = hours > 0 ? `+${hours}h` : (minutes > 0 ? `+${minutes}m` : 'ASAP');
        showToast(`Time set to ${msg}`, 'info');
    }, [showToast]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.firstName.trim()) {
            showToast('First Name is required', 'error');
            return false;
        }
        if (!form.contact.trim() || form.contact.length !== 10) {
            showToast('Enter a valid 10-digit phone number', 'error');
            return false;
        }

        if (form.email && !EMAIL_REGEX.test(form.email)) {
            showToast('Please enter a valid email address', 'error');
            return false;
        }

        const now = new Date();
        if (form.appointmentDateTime <= now && !form.availableAtClinic) {
            newErrors.appointmentDateTime = 'Date must be in the future';
        }

        // Validate availability
        if (!profile?.availability || profile.availability.length === 0) {
            showToast('Please configure your availability in your profile first.', 'error');
            return false;
        }

        const DAYS_MAP = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const selectedDayName = DAYS_MAP[form.appointmentDateTime.getDay()];

        const dayData = profile.availability.find(a => a.day === selectedDayName);

        if (!dayData) {
            const prettyDay = selectedDayName.charAt(0) + selectedDayName.slice(1).toLowerCase();
            newErrors.appointmentDateTime = `You are not available on ${prettyDay}s.`;
        } else if (!dayData.slots || dayData.slots.length === 0) {
            newErrors.appointmentTime = `You have no time slots configured for ${selectedDayName}.`;
        } else {
            const parseTimeToMinutes = (timeStr: string): number => {
                const cleanStr = timeStr.trim().toLowerCase();
                const isPm = cleanStr.includes('pm');
                const temp = cleanStr.replace(/[^0-9:]/g, '');
                const [hStr, mStr] = temp.split(':');
                let hour = parseInt(hStr, 10);
                const minute = parseInt(mStr, 10);
                if (hour === 12) {
                    hour = 0;
                }
                if (isPm) {
                    hour += 12;
                }
                return hour * 60 + minute;
            };

            const apptMinutes = form.appointmentDateTime.getHours() * 60 + form.appointmentDateTime.getMinutes();
            let isWithinSlot = false;

            for (const slot of dayData.slots) {
                try {
                    if (slot.startTime && slot.endTime) {
                        const startMinutes = parseTimeToMinutes(slot.startTime);
                        const endMinutes = parseTimeToMinutes(slot.endTime);
                        if (apptMinutes >= startMinutes && apptMinutes <= endMinutes) {
                            isWithinSlot = true;
                            break;
                        }
                    }
                } catch (e) {
                    // ignore
                }
            }

            if (!isWithinSlot) {
                newErrors.appointmentTime = 'Selected time is outside your configured availability slots.';
            }
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.values(newErrors)[0];
            showToast(firstError, 'error');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        haptics.impact();
        if (!validateForm()) return;
        setShowSummary(true);
    };

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                patientName: `${form.firstName} ${form.lastName}`.trim(),
                contact: form.contact,
                email: form.email || undefined,
                description: form.description?.trim() || null,
                appointmentDateTime: form.appointmentDateTime.toISOString(),
                paymentStatus: form.paymentStatus,
                availableAtClinic: form.availableAtClinic,
                appointmentType: form.availableAtClinic ? 'IN_PERSON' : 'ONLINE',
                isEmergency: form.isEmergency,
            };

            const result = await dispatch(bookAppointment(payload as any));

            if (bookAppointment.fulfilled.match(result)) {
                showToast(form.isEmergency ? 'Emergency team notified. Booking saved!' : 'Appointment booked successfully!', 'success');
                setShowSummary(false);
                // Reset form
                setForm({
                    firstName: '',
                    lastName: '',
                    contact: '',
                    maskedContact: '',
                    email: '',
                    description: '',
                    gender: 'Male',
                    ageGroup: 'Adult',
                    paymentStatus: true,
                    availableAtClinic: true,
                    isEmergency: false,
                    appointmentDateTime: new Date(),
                });
                setShowAdditional(false);
            } else {
                const error = (result.payload as any) || result.error?.message || 'Booking failed';
                showToast(typeof error === 'string' ? error : 'Failed to book appointment', 'error');
            }
        } catch (error) {
            showToast('An unexpected error occurred', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDark ? require('@assets/docbgdark.jpg') : require('@assets/docbglight.jpg')}
                style={styles.background}
                resizeMode="cover"
            >
                <SafeAreaView edges={['top']} style={styles.overlay}>
                    <KeyboardAwareScrollView
                        ref={scrollViewRef}
                        style={{ flex: 1 }}
                        enableOnAndroid={true}
                        extraScrollHeight={20}
                        enableAutomaticScroll={true}
                        contentContainerStyle={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                tintColor={theme.palette.primary[500]}
                                colors={[theme.palette.primary[500]]}
                                progressBackgroundColor={isDark ? theme.background.card : '#FFF'}
                            />
                        }
                    >
                        <View style={styles.header}>
                            <View style={styles.headerTitleContainer}>
                                <Text variant="h2" weight="bold" style={form.isEmergency ? styles.headerEmergencyTitle : undefined}>
                                    {form.isEmergency ? 'Emergency Protocol' : 'Add Appointment'}
                                </Text>
                                <Text variant="bodyMedium" color={theme.text.secondary}>
                                    {form.isEmergency ? 'Priority booking for urgent medical care' : 'Create a new patient booking'}
                                </Text>
                            </View>
                            {form.isEmergency && (
                                <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                    <AlertCircle size={24} color="#ef4444" />
                                </View>
                            )}
                        </View>

                        {/* Verification Warning Banner */}
                        {profile?.verificationStatus !== 'VERIFIED' && (
                            <FadeInView delay={0} duration={300} style={styles.warningBanner}>
                                <View style={styles.warningIconContainer}>
                                    <AlertCircle size={20} color="#ef4444" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text variant="bodyMedium" weight="bold" color="#ef4444">
                                        Booking Restricted
                                    </Text>
                                    <Text variant="bodySmall" color={theme.text.secondary} style={{ marginTop: 2 }}>
                                        {profile?.verificationStatus === 'SUSPENDED'
                                            ? 'Your practice account is suspended due to license expiry or administrative actions.'
                                            : profile?.verificationStatus === 'TERMINATED'
                                            ? 'Your practice account has been terminated.'
                                            : profile?.verificationStatus === 'DENIED'
                                            ? 'Your verification request was denied.'
                                            : profile?.verificationStatus === 'REJECTED'
                                            ? 'Your verification request was rejected.'
                                            : 'Your practice account is pending verification. You can book appointments once verified.'}
                                    </Text>
                                </View>
                            </FadeInView>
                        )}

                        {/* Emergency Toggle Card */}
                        <AddAppointmentCard isDark={isDark} theme={theme} delay={50} style={form.isEmergency ? styles.emergencyCard : undefined}>
                            <View style={styles.emergencyToggleRow}>
                                <View style={styles.emergencyIconLabelRow}>
                                    <View style={[styles.iconContainer, { backgroundColor: form.isEmergency ? 'rgba(239, 68, 68, 0.2)' : theme.background.subtle }]}>
                                        <Zap size={20} color={form.isEmergency ? '#ef4444' : theme.text.tertiary} />
                                    </View>
                                    <View>
                                        <Text weight="bold" color={form.isEmergency ? '#ef4444' : theme.text.primary}>Emergency Priority</Text>
                                        <Text variant="caption" color={theme.text.secondary}>Mark as urgent requirement</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                                        haptics.impact();
                                        updateForm('isEmergency', !form.isEmergency);
                                    }}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.switchTrack,
                                        form.isEmergency && styles.switchTrackActive
                                    ]}
                                >
                                    <View style={[
                                        styles.switchThumb,
                                        form.isEmergency && styles.switchThumbActive
                                    ]} />
                                </TouchableOpacity>
                            </View>
                        </AddAppointmentCard>

                        {/* Patient Info Card */}
                        <AddAppointmentCard isDark={isDark} theme={theme} delay={100} style={{ marginTop: spacing.l }}>
                            <Text variant="h4" color={theme.palette.primary[500]} weight="bold" style={styles.patientDetailsHeader}>Patient Details</Text>
                            <View style={styles.sectionRow}>
                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Input
                                            placeholder="First Name"
                                            value={form.firstName}
                                            onChangeText={t => updateForm('firstName', t)}
                                            returnKeyType="next"
                                            onSubmitEditing={() => lastRef.current?.focus()}
                                        />
                                        <VerificationBadge visible={form.firstName.length > 1} styles={styles} />
                                    </View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View>
                                        <Input
                                            ref={lastRef}
                                            placeholder="Last Name"
                                            value={form.lastName}
                                            onChangeText={t => updateForm('lastName', t)}
                                            returnKeyType="next"
                                            onSubmitEditing={() => phoneRef.current?.focus()}
                                        />
                                        <VerificationBadge visible={form.lastName.length > 1} styles={styles} />
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: spacing.m }}>
                                <View>
                                    <Input
                                        ref={phoneRef}
                                        placeholder="Mobile Number"
                                        value={form.maskedContact}
                                        onChangeText={t => {
                                            const clean = t.replace(/\D/g, '').slice(0, 10);
                                            setForm(prev => ({
                                                ...prev,
                                                contact: clean,
                                                maskedContact: formatPhoneNumber(clean)
                                            }));
                                        }}
                                        keyboardType="phone-pad"
                                        maxLength={14} // (XXX) XXX-XXXX
                                        leftIcon={<Phone size={18} color={theme.text.secondary} />}
                                        returnKeyType="next"
                                        onSubmitEditing={() => emailRef.current?.focus()}
                                    />
                                    <VerificationBadge visible={form.contact.length === 10} styles={styles} />
                                </View>
                            </View>

                            {/* Medical Context (Stage 2) */}
                            <View style={{ marginTop: spacing.l }}>
                                <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ marginBottom: spacing.xs, textTransform: 'uppercase' }}>Gender</Text>
                                <View style={styles.medicalChipsContainer}>
                                    {['Male', 'Female', 'Other'].map(g => (
                                        <SelectionChip
                                            key={g}
                                            label={g}
                                            active={form.gender === g}
                                            onPress={() => updateForm('gender', g)}
                                            isDark={isDark}
                                            theme={theme}
                                        />
                                    ))}
                                </View>

                                <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ marginBottom: spacing.xs, textTransform: 'uppercase' }}>Age Group</Text>
                                <View style={styles.medicalChipsContainer}>
                                    {['Adult', 'Child', 'Senior'].map(a => (
                                        <SelectionChip
                                            key={a}
                                            label={a}
                                            active={form.ageGroup === a}
                                            onPress={() => updateForm('ageGroup', a)}
                                            isDark={isDark}
                                            theme={theme}
                                        />
                                    ))}
                                </View>
                            </View>
                        </AddAppointmentCard>

                        {/* Progressive Disclosure: Only show scheduling if basic info is ready */}
                        {isBasicInfoComplete && (
                            <FadeInView duration={600} style={{ width: '100%' }}>
                                {/* Scheduling Card */}
                                <AddAppointmentCard delay={100} style={[{ marginTop: spacing.l }, form.isEmergency && styles.emergencyCard]} isDark={isDark} theme={theme}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.m }}>
                                        <Text variant="h4" color={theme.palette.primary[500]} weight="bold">Scheduling</Text>
                                        <TouchableOpacity
                                            onPress={() => { haptics.selection(); setShowAvailabilityInfo(true); }}
                                            activeOpacity={0.7}
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 4,
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                borderRadius: 20,
                                                backgroundColor: isDark ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.08)',
                                                borderWidth: 1,
                                                borderColor: 'rgba(14,165,233,0.25)',
                                            }}
                                        >
                                            <Info size={13} color={theme.palette.primary[500]} strokeWidth={2.5} />
                                            <Text variant="caption" color={theme.palette.primary[500]} weight="semibold">Availability</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: spacing.m }}>
                                        <DateTimeButton
                                            label="Date"
                                            value={form.appointmentDateTime.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                                            icon={CalendarIcon}
                                            onPress={() => setShowDatePicker(true)}
                                            isDark={isDark}
                                            theme={theme}
                                            hasError={!!errors.appointmentDateTime}
                                        />
                                        <DateTimeButton
                                            label="Time"
                                            value={form.appointmentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            icon={Clock}
                                            onPress={() => setShowTimePicker(true)}
                                            isDark={isDark}
                                            theme={theme}
                                            hasError={!!errors.appointmentTime}
                                        />
                                    </View>
                                    {errors.appointmentDateTime && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
                                            <AlertCircle size={14} color={theme.status.error} />
                                            <Text style={{ color: theme.status.error, fontSize: 12, flex: 1 }}>{errors.appointmentDateTime}</Text>
                                        </View>
                                    )}
                                    {errors.appointmentTime && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
                                            <AlertCircle size={14} color={theme.status.error} />
                                            <Text style={{ color: theme.status.error, fontSize: 12, flex: 1 }}>{errors.appointmentTime}</Text>
                                        </View>
                                    )}

                                    {/* Quick Time Chips */}
                                    <View style={styles.quickTimeContainer}>
                                        {[
                                            { label: 'ASAP', hours: 0, mins: 0 },
                                            { label: '+15m', hours: 0, mins: 15 },
                                            { label: '+1h', hours: 1, mins: 0 },
                                            { label: '+2h', hours: 2, mins: 0 },
                                            { label: '+24h', hours: 24, mins: 0 },
                                        ].map(opt => (
                                            <TouchableOpacity
                                                key={opt.label}
                                                onPress={() => handleQuickTime(opt.hours, opt.mins)}
                                                style={[
                                                    styles.chip,
                                                    { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: theme.border.subtle }
                                                ]}
                                            >
                                                <Text variant="caption" weight="bold" color={theme.palette.primary[500]}>{opt.label}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View style={styles.divider} />

                                    <Text variant="caption" color={theme.text.tertiary} style={{ marginBottom: spacing.s, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Session Details
                                    </Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, alignItems: 'center' }}>
                                        <SelectionChip
                                            label="In-Clinic"
                                            active={form.availableAtClinic}
                                            onPress={() => updateForm('availableAtClinic', true)}
                                            icon={MapPin}
                                            isDark={isDark}
                                            theme={theme}
                                        />
                                        <SelectionChip
                                            label={form.paymentStatus ? "Paid" : "Unpaid"}
                                            active={form.paymentStatus}
                                            onPress={() => updateForm('paymentStatus', !form.paymentStatus)}
                                            icon={CreditCard}
                                            isDark={isDark}
                                            theme={theme}
                                        />
                                    </View>
                                </AddAppointmentCard>

                                {/* Additional Info Section */}
                                <TouchableOpacity
                                    onPress={() => { setShowAdditional(!showAdditional); haptics.selection(); }}
                                    style={[
                                        styles.accordionHeader,
                                        { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff' },
                                        form.isEmergency && { borderColor: 'rgba(239, 68, 68, 0.3)' }
                                    ]}
                                    activeOpacity={0.8}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <FileText size={18} color={form.isEmergency ? '#ef4444' : theme.text.secondary} style={{ marginRight: 10 }} />
                                        <Text variant="bodyMedium" weight="medium" color={form.isEmergency ? '#ef4444' : theme.text.primary}>Additional Info</Text>
                                    </View>
                                    {showAdditional ?
                                        <ChevronUp size={20} color={form.isEmergency ? '#ef4444' : theme.text.secondary} /> :
                                        <ChevronDown size={20} color={form.isEmergency ? '#ef4444' : theme.text.secondary} />
                                    }
                                </TouchableOpacity>

                                {showAdditional && (
                                    <AddAppointmentCard style={{ marginTop: spacing.s }} isDark={isDark} theme={theme}>
                                        <View>
                                            <Input
                                                ref={emailRef}
                                                placeholder="Email Address (Optional)"
                                                value={form.email}
                                                onChangeText={t => updateForm('email', t)}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                leftIcon={<Mail size={18} color={theme.text.secondary} />}
                                                returnKeyType="done"
                                            />
                                            <VerificationBadge visible={form.email.length > 0 && EMAIL_REGEX.test(form.email)} styles={styles} />
                                        </View>
                                        <View style={{ marginTop: spacing.m }}>
                                            {/* Reason Chips (Stage 2) */}
                                            <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ marginBottom: spacing.s, textTransform: 'uppercase' }}>Quick Reason</Text>
                                            <View style={styles.reasonChipsContainer}>
                                                {['Fever', 'Consultation', 'General Checkup', 'Report Review', 'Pain'].map(r => (
                                                    <TouchableOpacity
                                                        key={r}
                                                        onPress={() => handleReasonSelect(r)}
                                                        style={[
                                                            styles.chip,
                                                            { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: theme.border.subtle }
                                                        ]}
                                                    >
                                                        <Text variant="caption" weight="medium" color={theme.text.secondary}>{r}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>

                                            <View>
                                                <TextInput
                                                    placeholder="Patient Description (Optional)"
                                                    placeholderTextColor={theme.text.tertiary}
                                                    value={form.description}
                                                    onChangeText={t => updateForm('description', t)}
                                                    multiline
                                                    maxLength={500}
                                                    style={[
                                                        {
                                                            backgroundColor: theme.background.subtle,
                                                            borderRadius: radius.m,
                                                            padding: spacing.m,
                                                            borderWidth: 1,
                                                            borderColor: isDescriptionFocused ? theme.palette.primary[500] : theme.border.subtle,
                                                            color: theme.text.primary,
                                                            fontSize: 16,
                                                            height: 120,
                                                            textAlignVertical: 'top',
                                                            shadowColor: theme.palette.primary[500],
                                                            shadowOffset: { width: 0, height: 2 },
                                                            shadowOpacity: isDescriptionFocused ? 0.15 : 0.05,
                                                            shadowRadius: isDescriptionFocused ? 10 : 5,
                                                        },
                                                        isDescriptionFocused && { backgroundColor: theme.background.default }
                                                    ]}
                                                    onFocus={() => setIsDescriptionFocused(true)}
                                                    onBlur={() => setIsDescriptionFocused(false)}
                                                    returnKeyType="default"
                                                    blurOnSubmit={false}
                                                />
                                                <VerificationBadge visible={form.description.trim().length > 3} styles={styles} />
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                                                <Text variant="caption" color={theme.text.tertiary}>
                                                    {form.description.length}/500
                                                </Text>
                                            </View>
                                        </View>
                                    </AddAppointmentCard>
                                )}
                            </FadeInView>
                        )}
                    </KeyboardAwareScrollView>

                    {/* Booking Confirmation FAB */}
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            activeOpacity={0.9}
                            disabled={isSubmitting || profile?.verificationStatus !== 'VERIFIED'}
                            style={[
                                styles.fabButton,
                                shadows.l,
                                profile?.verificationStatus !== 'VERIFIED' && { opacity: 0.6 }
                            ]}
                        >
                            <LinearGradient
                                colors={
                                    profile?.verificationStatus !== 'VERIFIED'
                                        ? ['#6b7280', '#4b5563']
                                        : form.isEmergency
                                        ? ['#ef4444', '#b91c1c']
                                        : ((theme as any).gradients?.primary || ['#0ea5e9', '#0284c7'])
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientButton}
                            >
                                {isSubmitting ? (
                                    <Text color="#FFF" weight="bold">Processing...</Text>
                                ) : (
                                    <>
                                        <Text variant="bodyLarge" color="#FFF" weight="bold" style={{ marginRight: 8 }}>
                                            {profile?.verificationStatus !== 'VERIFIED'
                                                ? 'Verification Required'
                                                : form.isEmergency
                                                ? 'Confirm Emergency Service'
                                                : 'Confirm Booking'}
                                        </Text>
                                        <Check size={20} color="#FFF" strokeWidth={3} />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker
                            value={form.appointmentDateTime}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            value={form.appointmentDateTime}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleTimeChange}
                        />
                    )}

                    <Toast
                        visible={toast.visible}
                        message={toast.message}
                        type={toast.type}
                        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
                    />

                    {/* Booking Summary Modal */}
                    <BookingSummaryModal
                        visible={showSummary}
                        onConfirm={handleConfirmBooking}
                        onCancel={() => setShowSummary(false)}
                        data={form}
                        isSubmitting={isSubmitting}
                        theme={theme}
                        isDark={isDark}
                        styles={styles}
                    />

                    {/* Availability Info Modal */}
                    <Modal
                        visible={showAvailabilityInfo}
                        transparent
                        statusBarTranslucent
                        animationType="fade"
                        onRequestClose={() => setShowAvailabilityInfo(false)}
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.55)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: spacing.l,
                        }}>
                            <View style={{
                                backgroundColor: isDark ? '#1e2433' : '#ffffff',
                                borderRadius: 20,
                                width: '100%',
                                maxWidth: 420,
                                overflow: 'hidden',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3,
                                shadowRadius: 24,
                                elevation: 12,
                            }}>
                                {/* Header */}
                                <LinearGradient
                                    colors={(theme as any).gradients?.primary || ['#0ea5e9', '#0284c7']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ padding: spacing.l, paddingBottom: spacing.m }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 6 }}>
                                                <Info size={18} color="#fff" strokeWidth={2.5} />
                                            </View>
                                            <View>
                                                <Text variant="h4" color="#fff" weight="bold">My Availability</Text>
                                                <Text variant="caption" color="rgba(255,255,255,0.75)">Patients can book only in these windows</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => setShowAvailabilityInfo(false)}
                                            style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 6 }}
                                        >
                                            <XIcon size={16} color="#fff" strokeWidth={2.5} />
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>

                                {/* Body */}
                                <View style={{ padding: spacing.l }}>
                                    {/* Availability */}
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.m }}>
                                            <CalendarIcon size={15} color={theme.palette.primary[500]} strokeWidth={2} />
                                            <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ textTransform: 'uppercase', flexShrink: 0 }} numberOfLines={1}>Availability</Text>
                                        </View>
                                        <View style={{ gap: 12 }}>
                                            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((dayName) => {
                                                const a = profile?.availability?.find((item: any) => item.day === dayName);
                                                const hasSlots = a && a.slots && a.slots.length > 0;
                                                return (
                                                    <View key={dayName} style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }, !hasSlots && { opacity: 0.7 }]}>
                                                        <View style={{ width: 85, paddingVertical: 4 }}>
                                                            <Text variant="caption" weight="semibold" color={hasSlots ? theme.palette.primary[500] : theme.text.tertiary}>
                                                                {dayName.charAt(0) + dayName.slice(1).toLowerCase()}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                                                            {hasSlots ? a.slots.map((slot: any, idx: number) => (
                                                                <View key={idx} style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: isDark ? 'rgba(14,165,233,0.15)' : 'rgba(14,165,233,0.08)', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(14,165,233,0.3)' }}>
                                                                    <Text variant="caption" color={theme.text.secondary}>{slot.startTime} - {slot.endTime}</Text>
                                                                </View>
                                                            )) : (
                                                                <View style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: theme.status?.errorBg || '#fee2e2' + '20', borderRadius: 6 }}>
                                                                    <Text variant="caption" weight="medium" color={theme.status?.error || '#ef4444'}>Closed</Text>
                                                                </View>
                                                            )}
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>

                                    {/* Footer note */}
                                    <View style={{ marginTop: spacing.l, padding: spacing.m, backgroundColor: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(14,165,233,0.06)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(14,165,233,0.18)', flexDirection: 'row', gap: 8 }}>
                                        <AlertCircle size={14} color={theme.palette.primary[500]} style={{ marginTop: 1 }} />
                                        <Text variant="caption" color={theme.text.secondary} style={{ flex: 1, lineHeight: 18 }}>
                                            Appointments outside these windows will be rejected. Update your availability in Profile settings.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

export default AddAppointmentScreen;
