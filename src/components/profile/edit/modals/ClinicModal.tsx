import React, { useState, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Location from 'expo-location';
import { MapPin } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';
import { createModalComponentStyles } from '@/styles/components/profile/edit/modals/ModalComponents.styles';
import { useToast } from '@/context/ToastContext';
import { VerificationBadge } from '@/components/ui/VerificationBadge';

interface ClinicModalProps {
    data: {
        clinicName?: string;
        clinicEmail?: string;
        clinicContactNumber?: string;
        clinicAddress?: string;
        consultationFee?: number;
    };
    onUpdate: (newData: any) => void;
    onSave: () => void;
    onClose: () => void;
    loading?: boolean;
}

export const ClinicModal: React.FC<ClinicModalProps> = ({
    data,
    onUpdate,
    onSave,
    onClose,
    loading
}) => {
    const { theme } = useTheme();
    const commonStyles = useMemo(() => createEditComponentStyles(theme), [theme]);
    const modalStyles = useMemo(() => createModalComponentStyles(theme), [theme]);
    const { showToast } = useToast();
    const [fetchingLocation, setFetchingLocation] = useState(false);

    const handleFetchLocation = async () => {
        setFetchingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                showToast('Permission to access location was denied', 'error');
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const [result] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (result) {
                const fullAddress = [
                    result.streetNumber,
                    result.street,
                    result.name,
                    result.city || result.subregion,
                    result.region,
                    result.country,
                    result.postalCode
                ]
                    .filter(Boolean)
                    .join(', ');

                onUpdate({ clinicAddress: fullAddress });
                showToast('Clinic address updated', 'success');
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to fetch location', 'error');
        } finally {
            setFetchingLocation(false);
        }
    };

    return (
        <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={100} enableAutomaticScroll={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalStyles.scrollContent}
            enableOnAndroid={true}
            extraScrollHeight={20}
            enableAutomaticScroll={true}
        >
            <TouchableOpacity
                style={modalStyles.locationButton}
                onPress={handleFetchLocation}
                disabled={fetchingLocation}
            >
                {fetchingLocation ? (
                    <ActivityIndicator size="small" color={theme.palette.primary[500]} />
                ) : (
                    <MapPin size={18} color={theme.palette.primary[500]} />
                )}
                <Text color={theme.palette.primary[500]} weight="bold">
                    {fetchingLocation ? 'Fetching Location...' : 'Use Current Clinic Location'}
                </Text>
            </TouchableOpacity>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Clinic Name</Text>
                <View>
                    <TextInput
                        style={commonStyles.premiumInput}
                        value={data.clinicName}
                        onChangeText={(val) => onUpdate({ clinicName: val })}
                        placeholder="Enter clinic name"
                        placeholderTextColor={theme.text.tertiary}
                    />
                    <VerificationBadge visible={!!data.clinicName} style={{ top: 12 }} />
                </View>
            </View>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Clinic Contact</Text>
                <View>
                    <TextInput
                        style={commonStyles.premiumInput}
                        value={data.clinicContactNumber}
                        onChangeText={(val) => onUpdate({ clinicContactNumber: val })}
                        keyboardType="phone-pad"
                        placeholder="Enter contact number"
                        placeholderTextColor={theme.text.tertiary}
                    />
                    <VerificationBadge visible={!!data.clinicContactNumber && data.clinicContactNumber.length > 9} style={{ top: 12 }} />
                </View>
            </View>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Clinic Email</Text>
                <View>
                    <TextInput
                        style={commonStyles.premiumInput}
                        value={data.clinicEmail}
                        onChangeText={(val) => onUpdate({ clinicEmail: val })}
                        keyboardType="email-address"
                        placeholder="Enter clinic email"
                        placeholderTextColor={theme.text.tertiary}
                    />
                    <VerificationBadge visible={!!data.clinicEmail && /\S+@\S+\.\S+/.test(data.clinicEmail)} style={{ top: 12 }} />
                </View>
            </View>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Consultation Fee (₹)</Text>
                <View>
                    <TextInput
                        style={commonStyles.premiumInput}
                        value={data.consultationFee?.toString()}
                        onChangeText={(val) => onUpdate({ consultationFee: parseFloat(val) || 0 })}
                        keyboardType="numeric"
                        placeholder="e.g. 500"
                        placeholderTextColor={theme.text.tertiary}
                    />
                    <VerificationBadge visible={!!data.consultationFee && data.consultationFee > 0} style={{ top: 12 }} />
                </View>
            </View>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Full Address</Text>
                <View>
                    <TextInput
                        style={[commonStyles.premiumInput, { height: 120, textAlignVertical: 'top' }]}
                        value={data.clinicAddress}
                        onChangeText={(val) => onUpdate({ clinicAddress: val })}
                        multiline
                        placeholder="Enter full clinic address"
                        placeholderTextColor={theme.text.tertiary}
                    />
                    <VerificationBadge visible={!!data.clinicAddress} style={{ top: 12 }} />
                </View>
            </View>

            <View style={modalStyles.footer}>
                <Button
                    title="Save Details"
                    onPress={onSave}
                    isLoading={loading}
                    fullWidth
                    style={modalStyles.primaryButtonGlow}
                />
                <Button title="Cancel" variant="outline" onPress={onClose} fullWidth />
            </View>
        </KeyboardAwareScrollView>
    );
};
