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

interface LocationModalProps {
    address: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
    };
    onUpdate: (newData: any) => void;
    onSave: () => void;
    onClose: () => void;
    loading?: boolean;
}

export const LocationModal: React.FC<LocationModalProps> = ({
    address,
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
                const street = [result.streetNumber, result.street, result.name]
                    .filter(Boolean)
                    .join(' ') || '';

                onUpdate({
                    street,
                    city: result.city || result.subregion || '',
                    state: result.region || '',
                    country: result.country || '',
                    pincode: result.postalCode || '',
                });
                showToast('Location updated', 'success');
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
            extraScrollHeight={50}
            keyboardShouldPersistTaps="handled"
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
                    {fetchingLocation ? 'Fetching Location...' : 'Use Current Location'}
                </Text>
            </TouchableOpacity>

            <View style={commonStyles.inputContainer}>
                <Text style={commonStyles.label}>Street Address</Text>
                <View>
                    <TextInput
                        style={commonStyles.premiumInput}
                        value={address.street}
                        onChangeText={(val) => onUpdate({ street: val })}
                        placeholder="e.g. 123 Medical Lane"
                        placeholderTextColor={theme.text.tertiary}
                    />
                    <VerificationBadge visible={!!address.street} style={{ top: 12 }} />
                </View>
            </View>

            <View style={modalStyles.inputRow}>
                <View style={[commonStyles.inputContainer, modalStyles.flex1]}>
                    <Text style={commonStyles.label}>City</Text>
                    <View>
                        <TextInput
                            style={commonStyles.premiumInput}
                            value={address.city}
                            onChangeText={(val) => onUpdate({ city: val })}
                            placeholder="City"
                            placeholderTextColor={theme.text.tertiary}
                        />
                        <VerificationBadge visible={!!address.city} style={{ top: 12 }} />
                    </View>
                </View>
                <View style={[commonStyles.inputContainer, modalStyles.flex1]}>
                    <Text style={commonStyles.label}>State</Text>
                    <View>
                        <TextInput
                            style={commonStyles.premiumInput}
                            value={address.state}
                            onChangeText={(val) => onUpdate({ state: val })}
                            placeholder="State"
                            placeholderTextColor={theme.text.tertiary}
                        />
                        <VerificationBadge visible={!!address.state} style={{ top: 12 }} />
                    </View>
                </View>
            </View>

            <View style={modalStyles.inputRow}>
                <View style={[commonStyles.inputContainer, modalStyles.flex1]}>
                    <Text style={commonStyles.label}>Country</Text>
                    <View>
                        <TextInput
                            style={commonStyles.premiumInput}
                            value={address.country}
                            onChangeText={(val) => onUpdate({ country: val })}
                            placeholder="Country"
                            placeholderTextColor={theme.text.tertiary}
                        />
                        <VerificationBadge visible={!!address.country} style={{ top: 12 }} />
                    </View>
                </View>
                <View style={[commonStyles.inputContainer, modalStyles.flex1]}>
                    <Text style={commonStyles.label}>Pincode</Text>
                    <View>
                        <TextInput
                            style={commonStyles.premiumInput}
                            value={address.pincode}
                            onChangeText={(val) => onUpdate({ pincode: val })}
                            placeholder="Zip code"
                            placeholderTextColor={theme.text.tertiary}
                            keyboardType="numeric"
                        />
                        <VerificationBadge visible={!!address.pincode && address.pincode.length > 5} style={{ top: 12 }} />
                    </View>
                </View>
            </View>

            <View style={modalStyles.footer}>
                <Button
                    title="Update Address"
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
