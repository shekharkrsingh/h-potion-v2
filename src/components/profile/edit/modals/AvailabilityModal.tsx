import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Clock, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';

export interface DayAvailability {
    day: string;
    slots: { startTime: string; endTime: string }[];
}

interface AvailabilityModalProps {
    availability: DayAvailability[];
    onUpdateAvailability: (availability: DayAvailability[]) => void;
    onSave: () => void;
    onClose: () => void;
    loading?: boolean;
}

const DAYS_MAP = {
    'Mon': 'MONDAY',
    'Tue': 'TUESDAY',
    'Wed': 'WEDNESDAY',
    'Thu': 'THURSDAY',
    'Fri': 'FRIDAY',
    'Sat': 'SATURDAY',
    'Sun': 'SUNDAY'
};

const DAYS = Object.keys(DAYS_MAP);

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
    availability = [],
    onUpdateAvailability,
    onSave,
    onClose,
    loading
}) => {
    const { theme } = useTheme();
    const styles = React.useMemo(() => createEditComponentStyles(theme), [theme]);

    const [selectedDayKey, setSelectedDayKey] = useState<string>('Mon');
    const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
    const [tempStartTime, setTempStartTime] = useState(new Date());
    const [tempEndTime, setTempEndTime] = useState(new Date());

    const activeDayBackend = DAYS_MAP[selectedDayKey as keyof typeof DAYS_MAP];
    const activeDayData = availability.find(a => a.day === activeDayBackend);
    const isActiveDayEnabled = !!activeDayData;

    const toggleActiveDay = () => {
        if (isActiveDayEnabled) {
            onUpdateAvailability(availability.filter(a => a.day !== activeDayBackend));
        } else {
            onUpdateAvailability([...availability, { day: activeDayBackend, slots: [] }]);
        }
    };

    const formatTime = (date: Date) => {
        let timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        if (/^\d:/.test(timeStr)) {
            timeStr = '0' + timeStr;
        }
        return timeStr.toUpperCase();
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowPicker(null);
        if (selectedDate) {
            if (showPicker === 'start') setTempStartTime(selectedDate);
            else setTempEndTime(selectedDate);
        }
    };

    const confirmAddSlot = () => {
        if (!isActiveDayEnabled) return;
        
        const newSlot = {
            startTime: formatTime(tempStartTime),
            endTime: formatTime(tempEndTime)
        };

        const updatedAvailability = availability.map(a => {
            if (a.day === activeDayBackend) {
                return { ...a, slots: [...a.slots, newSlot] };
            }
            return a;
        });

        onUpdateAvailability(updatedAvailability);
    };

    const removeSlot = (index: number) => {
        if (!isActiveDayEnabled) return;

        const updatedAvailability = availability.map(a => {
            if (a.day === activeDayBackend) {
                return { ...a, slots: a.slots.filter((_, i) => i !== index) };
            }
            return a;
        });

        onUpdateAvailability(updatedAvailability);
    };

    return (
        <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={100} enableAutomaticScroll={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            enableOnAndroid={true}
            extraScrollHeight={100}
            enableAutomaticScroll={true}
        >
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Select Day to Edit</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {DAYS.map(day => {
                        const backendDay = DAYS_MAP[day as keyof typeof DAYS_MAP];
                        const isConfigured = availability.some(a => a.day === backendDay);
                        const isSelected = selectedDayKey === day;

                        return (
                            <TouchableOpacity
                                key={day}
                                onPress={() => setSelectedDayKey(day)}
                                style={[
                                    styles.premiumInput,
                                    { minWidth: 65, alignItems: 'center', paddingVertical: 10 },
                                    isSelected && styles.focusedInput,
                                    isConfigured && !isSelected && { borderColor: theme.palette.primary[300] }
                                ]}
                            >
                                <Text 
                                    weight={isSelected ? 'bold' : 'medium'}
                                    color={isSelected ? theme.palette.primary[500] : (isConfigured ? theme.text.primary : theme.text.secondary)}
                                >
                                    {day}
                                </Text>
                                {isConfigured && (
                                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: theme.palette.primary[500], marginTop: 4 }} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={{ 
                backgroundColor: theme.background.card, 
                borderRadius: 16, 
                padding: 16, 
                borderWidth: 1, 
                borderColor: theme.border.default,
                marginBottom: 20 
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text variant="h6" weight="bold">{selectedDayKey} Availability</Text>
                    <TouchableOpacity 
                        onPress={toggleActiveDay}
                        style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 12,
                            backgroundColor: isActiveDayEnabled ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                        }}
                    >
                        <Text variant="caption" weight="bold" color={isActiveDayEnabled ? theme.status.error : theme.status.success}>
                            {isActiveDayEnabled ? 'Mark as Unavailable' : 'Enable Day'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isActiveDayEnabled ? (
                    <View>
                        <Text style={styles.label}>Add New Slot</Text>
                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                            <TouchableOpacity
                                style={[styles.premiumInput, { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }]}
                                onPress={() => setShowPicker('start')}
                            >
                                <Clock size={16} color={theme.text.tertiary} />
                                <Text variant="caption">{formatTime(tempStartTime)}</Text>
                            </TouchableOpacity>
                            <Text style={{ alignSelf: 'center' }}>-</Text>
                            <TouchableOpacity
                                style={[styles.premiumInput, { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }]}
                                onPress={() => setShowPicker('end')}
                            >
                                <Clock size={16} color={theme.text.tertiary} />
                                <Text variant="caption">{formatTime(tempEndTime)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.editProfileButton, { position: 'relative' }]}
                                onPress={confirmAddSlot}
                            >
                                <Plus size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {(showPicker && Platform.OS !== 'web') && (
                            <DateTimePicker
                                value={showPicker === 'start' ? tempStartTime : tempEndTime}
                                mode="time"
                                is24Hour={false}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleTimeChange}
                            />
                        )}

                        <Text style={[styles.label, { marginTop: 4 }]}>Active Slots</Text>
                        {activeDayData.slots.length > 0 ? (
                            activeDayData.slots.map((slot, index) => (
                                <View key={index} style={[styles.premiumInput, { flexDirection: 'row', alignItems: 'center', marginBottom: 8 }]}>
                                    <Clock size={16} color={theme.text.tertiary} style={{ marginRight: 8 }} />
                                    <Text style={{ flex: 1 }}>{slot.startTime} - {slot.endTime}</Text>
                                    <TouchableOpacity onPress={() => removeSlot(index)}>
                                        <Trash2 size={16} color={theme.status.error} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={{ padding: 12, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 12, alignItems: 'center' }}>
                                <Text variant="caption" color={theme.text.tertiary}>No time slots added for this day yet.</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                        <CalendarIcon size={32} color={theme.text.tertiary} style={{ marginBottom: 12, opacity: 0.5 }} />
                        <Text color={theme.text.secondary} style={{ textAlign: 'center' }}>
                            You are currently unavailable on {DAYS_MAP[selectedDayKey as keyof typeof DAYS_MAP].toLowerCase()}s.
                        </Text>
                    </View>
                )}
            </View>

            <View style={{ gap: 12 }}>
                <Button title="Save Changes" onPress={onSave} isLoading={loading} fullWidth />
                <Button title="Cancel" variant="outline" onPress={onClose} fullWidth />
            </View>
        </KeyboardAwareScrollView>
    );
};
