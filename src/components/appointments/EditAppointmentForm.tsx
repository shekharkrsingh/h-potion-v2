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
import { X, Calendar, Clock, Save, Phone, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Appointment } from '@/store/slices/appointmentSlice';
import { spacing } from '@/theme/spacing';
import { radius } from '@/theme/radius';
import { haptics } from '@/utils/haptics';
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
    const isEmailValid = useMemo(() => formData.email.includes('@'), [formData.email]);

    // Memoized Icons (Fixing Flicker & Compilation Error)
    const firstNameIcon = useMemo(() => isFirstNameValid ? <VerificationBadge /> : undefined, [isFirstNameValid]);
    const lastNameIcon = useMemo(() => isLastNameValid ? <VerificationBadge /> : undefined, [isLastNameValid]);
    const contactIcon = useMemo(() => isContactValid ? <VerificationBadge /> : undefined, [isContactValid]);
    const emailIcon = useMemo(() => isEmailValid ? <VerificationBadge /> : undefined, [isEmailValid]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!isFirstNameValid) newErrors.firstName = 'First name is required';
        if (!isContactValid) newErrors.contact = 'Valid contact number required';

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
            setFormData(prev => {
                const newDate = new Date(prev.appointmentDateTime);
                if (showDatePicker) {
                    newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
                } else {
                    newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
                }
                return { ...prev, appointmentDateTime: newDate };
            });
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
                                style={commonStyles.premiumInput}
                                value={formData.email}
                                onChangeText={(val) => setFormData(p => ({ ...p, email: val }))}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholder="jane@example.com"
                                placeholderTextColor={theme.text.tertiary}
                            />
                            {isEmailValid && (
                                <View style={{ position: 'absolute', right: 12, top: 12 }}>
                                    <VerificationBadge />
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={commonStyles.inputContainer}>
                        <Text style={commonStyles.label}>Schedule</Text>
                        <View style={{ flexDirection: 'row', gap: spacing.m }}>
                            <TouchableOpacity
                                style={[commonStyles.premiumInput, { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }]}
                                onPress={() => { setShowDatePicker(true); setShowTimePicker(false); }}
                            >
                                <Calendar size={18} color={theme.palette.primary[500]} />
                                <Text color={theme.text.primary}>
                                    {formData.appointmentDateTime.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[commonStyles.premiumInput, { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }]}
                                onPress={() => { setShowTimePicker(true); setShowDatePicker(false); }}
                            >
                                <Clock size={18} color={theme.palette.primary[500]} />
                                <Text color={theme.text.primary}>
                                    {formData.appointmentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                        </View>

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
