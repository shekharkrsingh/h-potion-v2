import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Clock, Plus, Trash2 } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme/ThemeContext';
import { createEditComponentStyles } from '@/styles/components/EditComponents.styles';

interface AvailabilityModalProps {
    selectedDays: string[];
    timeSlots: { startTime: string; endTime: string }[];
    onUpdateDays: (days: string[]) => void;
    onAddTimeSlot: (slot: { startTime: string; endTime: string }) => void;
    onRemoveTimeSlot: (index: number) => void;
    onSave: () => void;
    onClose: () => void;
    loading?: boolean;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
    selectedDays,
    timeSlots,
    onUpdateDays,
    onAddTimeSlot,
    onRemoveTimeSlot,
    onSave,
    onClose,
    loading
}) => {
    const { theme } = useTheme();
    const styles = React.useMemo(() => createEditComponentStyles(theme), [theme]);

    const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);
    const [tempStartTime, setTempStartTime] = useState(new Date());
    const [tempEndTime, setTempEndTime] = useState(new Date());

    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            onUpdateDays(selectedDays.filter(d => d !== day));
        } else {
            onUpdateDays([...selectedDays, day]);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowPicker(null);
        if (selectedDate) {
            if (showPicker === 'start') setTempStartTime(selectedDate);
            else setTempEndTime(selectedDate);
        }
    };

    const confirmAdd = () => {
        onAddTimeSlot({
            startTime: formatTime(tempStartTime),
            endTime: formatTime(tempEndTime)
        });
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Working Days</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {DAYS.map(day => (
                        <TouchableOpacity
                            key={day}
                            onPress={() => toggleDay(day)}
                            style={[
                                styles.premiumInput,
                                { minWidth: 60, alignItems: 'center' },
                                selectedDays.includes(day) && styles.focusedInput
                            ]}
                        >
                            <Text color={selectedDays.includes(day) ? theme.palette.primary[500] : theme.text.secondary}>
                                {day}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>New Practice Slot</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
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
                        onPress={confirmAdd}
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

                <Text style={[styles.label, { marginTop: 12 }]}>Current Slots</Text>
                {timeSlots.map((slot, index) => (
                    <View key={index} style={[styles.premiumInput, { flexDirection: 'row', alignItems: 'center', marginBottom: 8 }]}>
                        <Clock size={16} color={theme.text.tertiary} style={{ marginRight: 8 }} />
                        <Text style={{ flex: 1 }}>{slot.startTime} - {slot.endTime}</Text>
                        <TouchableOpacity onPress={() => onRemoveTimeSlot(index)}>
                            <Trash2 size={16} color={theme.status.error} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={{ marginTop: 20, gap: 12 }}>
                <Button title="Save Changes" onPress={onSave} isLoading={loading} fullWidth />
                <Button title="Cancel" variant="outline" onPress={onClose} fullWidth />
            </View>
        </ScrollView>
    );
};
