import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { createStyles } from '@/styles/components/dashboard/AppointmentCard.styles';
import { MoreHorizontal, Video, User } from 'lucide-react-native';
import { ScalePress } from '@/components/ui/ScalePress';

export interface Appointment {
    id: string;
    patientName: string;
    time: string; // e.g., "10:30 AM"
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    type: 'online' | 'in-person';
    date: string; // e.g., "2024-01-28"
}

interface AppointmentCardProps {
    appointment: Appointment;
    onPress: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    // Helper to parse time string
    const [timeVal, ampm] = appointment.time.split(' ');

    const getStatusColors = (): { bg: string, text: string } => {
        switch (appointment.status) {
            case 'confirmed': return { bg: theme.status.successBg, text: theme.status.success };
            case 'pending': return { bg: theme.status.warningBg, text: theme.status.warning };
            case 'cancelled': return { bg: theme.status.errorBg, text: theme.status.error };
            case 'completed': return { bg: theme.status.infoBg, text: theme.status.info };
            default: return { bg: theme.background.subtle, text: theme.text.secondary };
        }
    };

    const statusColors = getStatusColors();

    const TypeIcon = appointment.type === 'online' ? Video : User;

    return (
        <ScalePress
            onPress={() => onPress(appointment.id)}
            style={styles.card}
        >
            <View style={[styles.timeContainer, { borderColor: theme.border.subtle }]}>
                <Text color={theme.text.primary} style={styles.time}>{timeVal}</Text>
                <Text color={theme.text.secondary} style={styles.ampm}>{ampm}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <Text color={theme.text.primary} style={styles.patientName}>{appointment.patientName}</Text>

                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <View style={[styles.statusBadge, {
                        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : statusColors.bg,
                        borderColor: statusColors.text,
                        borderWidth: 1
                    }]}>
                        <Text style={styles.statusText} color={statusColors.text}>
                            {appointment.status}
                        </Text>
                    </View>

                    <View style={styles.typeContainer}>
                        <TypeIcon size={12} color={theme.text.secondary} />
                        <Text color={theme.text.secondary} style={styles.typeText}>
                            {appointment.type === 'online' ? 'Video Call' : 'Visit'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.actionButton}>
                <MoreHorizontal size={20} color={theme.icon.default} />
            </View>
        </ScalePress>
    );
};
