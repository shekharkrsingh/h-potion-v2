import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableOpacity,
    Platform,
    Keyboard,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    TextInput
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Calendar, Clock, Save, Phone, Check, Info, AlertCircle } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Appointment } from '@/store/slices/appointmentSlice';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { haptics } from '@/utils/haptics';
import { parseTimeToMinutes } from '@/utils/timeUtils';
import { FadeInView } from '@/components/ui/FadeInView';
import { EditConfirmationModal } from './EditConfirmationModal';
import { BaseEditModal } from '../profile/edit/modals/BaseEditModal';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';
import { createModalComponentStyles } from '@/styles/components/profile/edit/modals/ModalComponents.styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const formatPhoneNumber = (digits: string) => {
    const clean = digits.replace(/\D/g, '').slice(0, 10);
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// External Verification Badge Component (Stable)
const VerificationBadge = () => {
    const { theme } = useTheme();
    return (
        <FadeInView delay={0} duration={300}>
            <View style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.palette.primary[500] // SKY BLUE ONLY
            }}>
                <Check size={12} color="#FFF" strokeWidth={3} />
            </View>
        </FadeInView>
    );
};

interface EditAppointmentFormProps {
    visible: boolean;
    onClose: () => void;
    onSave: (updates: any) => void;
    appointment: Appointment;
}

export const EditAppointmentForm: React.FC<EditAppointmentFormProps> = ({
    visible,
    onClose,
    onSave,
    appointment,
}) => {
    const { theme, isDark } = useTheme();
    const commonStyles = useMemo(() => createEditComponentStyles(theme), [theme]);
    const modalStyles = useMemo(() => createModalComponentStyles(theme), [theme]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        description: '',
        appointmentDateTime: new Date(),
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
    const [showAvailabilityInfo, setShowAvailabilityInfo] = useState(false);

    const profile = useSelector((state: RootState) => state.profile.data);
    const profileRole = useSelector((state: RootState) => state.profile.role);
    const { activeDoctorProfile } = useSelector((state: RootState) => state.activeDoctor);

    const isCollaborator = profileRole === 'COLLABORATOR';
    const doctorData = isCollaborator ? activeDoctorProfile : profile;

    useEffect(() => {
        if (visible && appointment) {
            const names = appointment.patientName.split(' ');
            setFormData({
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                contact: formatPhoneNumber(appointment.contact || ''),
                email: appointment.email || '',
                description: appointment.description || '',
                appointmentDateTime: new Date(appointment.appointmentDateTime),
            });
            setErrors({});
            setShowSummary(false);
        }
    }, [visible, appointment]);

    // Validation Logic with useMemo (Fixing Flicker)
    const isFirstNameValid = useMemo(() => formData.firstName.trim().length > 0, [formData.firstName]);
    const isLastNameValid = useMemo(() => formData.lastName.trim().length > 0, [formData.lastName]);
    const isContactValid = useMemo(() => formData.contact.replace(/\D/g, '').length >= 10, [formData.contact]);
    const isEmailValid = useMemo(() => {
        if (!formData.email) return true;
        return EMAIL_REGEX.test(formData.email);
    }, [formData.email]);
    const shouldShowEmailBadge = useMemo(() => formData.email.length > 0 && EMAIL_REGEX.test(formData.email), [formData.email]);

    // Memoized Icons (Fixing Flicker & Compilation Error)
    const firstNameIcon = useMemo(() => isFirstNameValid ? <VerificationBadge /> : undefined, [isFirstNameValid]);
    const lastNameIcon = useMemo(() => isLastNameValid ? <VerificationBadge /> : undefined, [isLastNameValid]);
    const contactIcon = useMemo(() => isContactValid ? <VerificationBadge /> : undefined, [isContactValid]);
    const emailIcon = useMemo(() => isEmailValid ? <VerificationBadge /> : undefined, [isEmailValid]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!isFirstNameValid) newErrors.firstName = 'First name is required';
        if (!isContactValid) newErrors.contact = 'Valid contact number required';
        if (!isEmailValid) newErrors.email = 'Please enter a valid email address';

        // Availability validation
        if (doctorData?.availability && doctorData.availability.length > 0) {
            const DAYS_MAP = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
            const selectedDayName = DAYS_MAP[formData.appointmentDateTime.getDay()];
            
            const dayData = doctorData.availability.find((a: any) => a.day === selectedDayName);
            
            if (!dayData) {
                const prettyDay = selectedDayName.charAt(0) + selectedDayName.slice(1).toLowerCase();
                newErrors.appointmentDateTime = `You are not available on ${prettyDay}s. Please select an available day.`;
            } else if (dayData.slots && dayData.slots.length > 0) {
                const apptMinutes = formData.appointmentDateTime.getHours() * 60 + formData.appointmentDateTime.getMinutes();
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
                }
            } else {
                newErrors.appointmentTime = `You have no time slots configured for ${selectedDayName}.`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveRequest = () => {
        if (!validate()) {
            haptics.error();
            return;
        }
        haptics.impact();
        setShowSummary(true);
    };

    const handleConfirmSave = () => {
        haptics.impact();
        onSave({
            patientName: `${formData.firstName} ${formData.lastName}`.trim(),
            contact: formData.contact,
            email: formData.email,
            description: formData.description,
            appointmentDateTime: formData.appointmentDateTime.toISOString(),
        });
        setShowSummary(false);
        onClose();
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
            setShowTimePicker(false);
        }

        if (selectedDate && event.type !== 'dismissed') {
            const newDate = new Date(formData.appointmentDateTime);
            if (showDatePicker) {
                newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            } else {
                newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
            }

            setFormData(prev => ({ ...prev, appointmentDateTime: newDate }));

            // Real-time validation
            const newErrors = { ...errors };
            if (doctorData?.availability && doctorData.availability.length > 0) {
                const DAYS_MAP = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
                const selectedDayName = DAYS_MAP[newDate.getDay()];
                const dayData = doctorData.availability.find((a: any) => a.day === selectedDayName);

                if (!dayData) {
                    const prettyDay = selectedDayName.charAt(0) + selectedDayName.slice(1).toLowerCase();
                    newErrors.appointmentDateTime = `You are not available on ${prettyDay}s. Please select an available day.`;
                    delete newErrors.appointmentTime;
                } else {
                    delete newErrors.appointmentDateTime;

                    if (dayData.slots && dayData.slots.length > 0) {
                        const apptMinutes = newDate.getHours() * 60 + newDate.getMinutes();
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
        }
    };

    return (
        <React.Fragment>
            <BaseEditModal
                visible={visible}
                title="Edit Appointment"
                onClose={onClose}
            >
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={modalStyles.scrollContent}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    enableAutomaticScroll={true}
                    keyboardShouldPersistTaps="handled"
                >
                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.label}>Patient Name</Text>
                            <View style={{ flexDirection: 'row', gap: spacing.m }}>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={[commonStyles.premiumInput, errors.firstName && { borderColor: theme.status.error }]}
                                        value={formData.firstName}
                                        onChangeText={(val) => setFormData(p => ({ ...p, firstName: val }))}
                                        placeholder="First Name"
                                        placeholderTextColor={theme.text.tertiary}
                                    />
                                    {isFirstNameValid && (
                                        <View style={{ position: 'absolute', right: 12, top: 12 }}>
                                            <VerificationBadge />
                                        </View>
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={commonStyles.premiumInput}
                                        value={formData.lastName}
                                        onChangeText={(val) => setFormData(p => ({ ...p, lastName: val }))}
                                        placeholder="Last Name"
                                        placeholderTextColor={theme.text.tertiary}
                                    />
                                    {isLastNameValid && (
                                        <View style={{ position: 'absolute', right: 12, top: 12 }}>
                                            <VerificationBadge />
                                        </View>
                                    )}
                                </View>
                            </View>
                            {errors.firstName && <Text style={{ color: theme.status.error, fontSize: 12, marginTop: 4 }}>{errors.firstName}</Text>}
                        </View>

                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.label}>Contact Number</Text>
                            <View>
                                <TextInput
                                    style={[commonStyles.premiumInput, errors.contact && { borderColor: theme.status.error }]}
                                    value={formData.contact}
                                    onChangeText={(val) => setFormData(p => ({ ...p, contact: formatPhoneNumber(val) }))}
                                    keyboardType="phone-pad"
                                    maxLength={14}
                                    placeholder="(555) 000-0000"
                                    placeholderTextColor={theme.text.tertiary}
                                />
                                {isContactValid && (
                                    <View style={{ position: 'absolute', right: 12, top: 12 }}>
                                        <VerificationBadge />
                                    </View>
                                )}
                            </View>
                            {errors.contact && <Text style={{ color: theme.status.error, fontSize: 12, marginTop: 4 }}>{errors.contact}</Text>}
                        </View>

                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.label}>Email (Optional)</Text>
                            <View>
                                <TextInput
                                    style={[commonStyles.premiumInput, errors.email && { borderColor: theme.status.error }]}
                                    value={formData.email}
                                    onChangeText={(val) => setFormData(p => ({ ...p, email: val }))}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholder="jane@example.com"
                                    placeholderTextColor={theme.text.tertiary}
                                />
                                {shouldShowEmailBadge && (
                                    <View style={{ position: 'absolute', right: 12, top: 12 }}>
                                        <VerificationBadge />
                                    </View>
                                )}
                            </View>
                            {errors.email && <Text style={{ color: theme.status.error, fontSize: 12, marginTop: 4 }}>{errors.email}</Text>}
                        </View>

                        <View style={commonStyles.inputContainer}>
                            {/* Schedule header row with Availability info pill */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                <Text style={commonStyles.label}>Schedule</Text>
                                <TouchableOpacity
                                    onPress={() => { haptics.selection(); setShowAvailabilityInfo(true); }}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4,
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 20,
                                        backgroundColor: isDark ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.08)',
                                        borderWidth: 1,
                                        borderColor: 'rgba(14,165,233,0.25)',
                                    }}
                                >
                                    <Info size={12} color={theme.palette.primary[500]} strokeWidth={2.5} />
                                    <Text variant="caption" color={theme.palette.primary[500]} weight="semibold">Availability</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flexDirection: 'row', gap: spacing.m }}>
                                <TouchableOpacity
                                    style={[
                                        commonStyles.premiumInput,
                                        { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
                                        errors.appointmentDateTime ? { borderColor: theme.status.error } : null
                                    ]}
                                    onPress={() => { setShowDatePicker(true); setShowTimePicker(false); }}
                                >
                                    <Calendar size={18} color={theme.palette.primary[500]} />
                                    <Text color={theme.text.primary} numberOfLines={1} adjustsFontSizeToFit style={{ flex: 1 }}>
                                        {formData.appointmentDateTime.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        commonStyles.premiumInput,
                                        { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
                                        errors.appointmentTime ? { borderColor: theme.status.error } : null
                                    ]}
                                    onPress={() => { setShowTimePicker(true); setShowDatePicker(false); }}
                                >
                                    <Clock size={18} color={theme.palette.primary[500]} />
                                    <Text color={theme.text.primary} numberOfLines={1} adjustsFontSizeToFit style={{ flex: 1 }}>
                                        {formData.appointmentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {errors.appointmentDateTime && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                                    <AlertCircle size={14} color={theme.status.error} />
                                    <Text style={{ color: theme.status.error, fontSize: 12, flex: 1 }}>{errors.appointmentDateTime}</Text>
                                </View>
                            )}
                            {errors.appointmentTime && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                                    <AlertCircle size={14} color={theme.status.error} />
                                    <Text style={{ color: theme.status.error, fontSize: 12, flex: 1 }}>{errors.appointmentTime}</Text>
                                </View>
                            )}

                            {(showDatePicker || showTimePicker) && (
                                <View style={{ marginTop: spacing.m, alignItems: 'center' }}>
                                    <DateTimePicker
                                        value={formData.appointmentDateTime}
                                        mode={showDatePicker ? 'date' : 'time'}
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onDateChange}
                                        textColor={theme.text.primary}
                                    />
                                    {Platform.OS === 'ios' && (
                                        <Button
                                            title="Done"
                                            size="sm"
                                            onPress={() => { setShowDatePicker(false); setShowTimePicker(false); }}
                                            style={{ marginTop: 8 }}
                                        />
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Inline Availability Info Card — shown when pill is tapped */}
                        {showAvailabilityInfo && (
                            <View style={{
                                marginBottom: 16,
                                borderRadius: 16,
                                overflow: 'hidden',
                                borderWidth: 1,
                                borderColor: 'rgba(14,165,233,0.25)',
                            }}>
                                {/* Card header */}
                                <LinearGradient
                                    colors={(theme as any).gradients?.primary || ['#0ea5e9', '#0284c7']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ paddingHorizontal: 16, paddingVertical: 12 }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <Info size={16} color="#fff" strokeWidth={2.5} />
                                            <Text variant="bodySmall" color="#fff" weight="bold">My Availability</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setShowAvailabilityInfo(false)}>
                                            <X size={16} color="rgba(255,255,255,0.85)" strokeWidth={2.5} />
                                        </TouchableOpacity>
                                    </View>
                                </LinearGradient>

                                {/* Card body */}
                                <View style={{
                                    backgroundColor: isDark ? 'rgba(14,165,233,0.06)' : 'rgba(14,165,233,0.04)',
                                    padding: 14,
                                    gap: 12,
                                }}>
                                    {/* Availability List */}
                                    <View>
                                        <Text variant="caption" weight="bold" color={theme.text.tertiary} style={{ textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                                            Availability
                                        </Text>
                                        {doctorData?.availability && doctorData.availability.length > 0 ? (
                                            <View style={{ gap: 10 }}>
                                                {doctorData.availability.map((a: any) => (
                                                    <View key={a.day} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                                        <View style={{ width: 80, paddingTop: 2 }}>
                                                            <Text variant="caption" weight="semibold" color={theme.palette.primary[500]}>
                                                                {a.day.charAt(0) + a.day.slice(1).toLowerCase()}
                                                            </Text>
                                                        </View>
                                                        <View style={{ flex: 1, gap: 4 }}>
                                                            {a.slots && a.slots.length > 0 ? a.slots.map((slot: any, idx: number) => (
                                                                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.palette.primary[500], marginRight: 6 }} />
                                                                    <Text variant="caption" color={theme.text.primary}>{slot.startTime} - {slot.endTime}</Text>
                                                                </View>
                                                            )) : <Text variant="caption" color={theme.text.tertiary}>No slots configured</Text>}
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <Text variant="caption" color={theme.status.error}>No availability configured.</Text>
                                        )}
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={commonStyles.inputContainer}>
                            <Text style={commonStyles.label}>Notes (Optional)</Text>
                            <View>
                                <TextInput
                                    style={[
                                        commonStyles.premiumInput,
                                        { height: 120, textAlignVertical: 'top' },
                                        isDescriptionFocused && commonStyles.focusedInput
                                    ]}
                                    value={formData.description}
                                    onChangeText={(val) => setFormData(p => ({ ...p, description: val }))}
                                    multiline
                                    placeholder="Add any additional notes here..."
                                    placeholderTextColor={theme.text.tertiary}
                                    onFocus={() => setIsDescriptionFocused(true)}
                                    onBlur={() => setIsDescriptionFocused(false)}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 }}>
                                    <Text variant="caption" color={theme.text.tertiary}>
                                        {(formData.description || '').length}/500
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={modalStyles.footer}>
                            <Button
                                title="Save Changes"
                                onPress={handleSaveRequest}
                                style={modalStyles.primaryButtonGlow}
                                fullWidth
                                leftIcon={<Save size={18} color="#FFF" />}
                            />
                            <Button title="Cancel" variant="outline" onPress={onClose} fullWidth />
                        </View>
                </KeyboardAwareScrollView>
            </BaseEditModal>

            <EditConfirmationModal
                visible={showSummary}
                onConfirm={handleConfirmSave}
                onCancel={() => setShowSummary(false)}
                data={formData}
            />
        </React.Fragment>
    );
};

// Styles moved to createEditComponentStyles and BaseEditModal
const createStyles = (theme: any, isDark: boolean, insets: any) => StyleSheet.create({});
