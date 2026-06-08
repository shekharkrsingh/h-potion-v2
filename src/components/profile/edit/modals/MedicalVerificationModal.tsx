import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Shield, Calendar } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';
import { createModalComponentStyles } from '@/styles/components/profile/edit/modals/ModalComponents.styles';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface MedicalVerificationModalProps {
    data: {
        licenseNumber?: string;
        licensingAuthority?: string;
        licenseExpiryDate?: string | Date;
        hasPendingVerification?: boolean;
    };
    onUpdate: (updates: any) => void;
    onSave: () => void;
    onClose: () => void;
    loading?: boolean;
}

export const MedicalVerificationModal: React.FC<MedicalVerificationModalProps> = ({
    data,
    onUpdate,
    onSave,
    onClose,
    loading
}) => {
    const { theme } = useTheme();
    const commonStyles = useMemo(() => createEditComponentStyles(theme), [theme]);
    const modalStyles = useMemo(() => createModalComponentStyles(theme), [theme]);

    const [showDatePicker, setShowDatePicker] = useState(false);

    const expiryDate = useMemo(() => {
        if (!data.licenseExpiryDate) return new Date();
        return new Date(data.licenseExpiryDate);
    }, [data.licenseExpiryDate]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (selectedDate) {
            onUpdate({ licenseExpiryDate: selectedDate.toISOString() });
        }
    };

    return (
        <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalStyles.scrollContent}
            enableOnAndroid={true}
            extraScrollHeight={50}
            keyboardShouldPersistTaps="handled"
        >
            <View style={{ alignItems: 'center', marginBottom: 24, marginTop: 8 }}>
                <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: `${theme.palette.primary[500]}10`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16
                }}>
                    <Shield size={28} color={theme.palette.primary[500]} />
                </View>
                <Text style={{ fontSize: 14, color: theme.text.tertiary, textAlign: 'center', paddingHorizontal: 20 }}>
                    Please enter your government-issued medical license details for verification.
                </Text>
            </View>

            {data.hasPendingVerification && (
                <View style={{
                    backgroundColor: theme.status.warningBg,
                    borderColor: theme.status.warning,
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 20,
                    marginHorizontal: 4,
                }}>
                    <Text style={{
                        fontSize: 13,
                        color: theme.palette.warning[600] || theme.status.warning,
                        fontWeight: '600',
                        marginBottom: 4
                    }}>
                        Verification Request Pending
                    </Text>
                    <Text style={{
                        fontSize: 12,
                        color: theme.text.secondary,
                        lineHeight: 18
                    }}>
                        Your previously submitted updates are currently under review. Submitting new details will overwrite your pending request.
                    </Text>
                </View>
            )}

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>License Number</Text>
                <View>
                    <TextInput
                        style={commonStyles.premiumInput}
                        value={data.licenseNumber || ''}
                        onChangeText={(val) => onUpdate({ licenseNumber: val })}
                        placeholder="e.g. MC-987654"
                        placeholderTextColor={theme.text.tertiary}
                    />
                    <VerificationBadge visible={!!data.licenseNumber} style={{ top: 12 }} />
                </View>
            </View>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Licensing Authority</Text>
                <View>
                    <TextInput
                        style={commonStyles.premiumInput}
                        value={data.licensingAuthority || ''}
                        onChangeText={(val) => onUpdate({ licensingAuthority: val })}
                        placeholder="e.g. Medical Council of California"
                        placeholderTextColor={theme.text.tertiary}
                    />
                    <VerificationBadge visible={!!data.licensingAuthority} style={{ top: 12 }} />
                </View>
            </View>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>License Expiry Date</Text>
                <View>
                    <TouchableOpacity
                        style={[commonStyles.premiumInput, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Calendar size={18} color={theme.text.tertiary} />
                        <Text style={{ color: data.licenseExpiryDate ? theme.text.primary : theme.text.tertiary }}>
                            {data.licenseExpiryDate 
                                ? expiryDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                                : 'Select Expiry Date'}
                        </Text>
                    </TouchableOpacity>
                    <VerificationBadge visible={!!data.licenseExpiryDate} style={{ top: 12 }} />
                </View>
            </View>

            {(showDatePicker && Platform.OS !== 'web') && (
                <DateTimePicker
                    value={expiryDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            <View style={modalStyles.footer}>
                <Button
                    title="Save Details"
                    onPress={onSave}
                    isLoading={loading}
                    disabled={!data.licenseNumber || !data.licensingAuthority || !data.licenseExpiryDate}
                    fullWidth
                    style={modalStyles.primaryButtonGlow}
                />
                <Button title="Cancel" variant="outline" onPress={onClose} fullWidth />
            </View>
        </KeyboardAwareScrollView>
    );
};
