import React, { useMemo } from 'react';
import { View } from 'react-native';
import { User } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { FadeInView } from '@/components/ui/FadeInView';
import { useTheme } from '@/theme/ThemeContext';
import { createAppointmentDetailComponentStyles } from '@/styles/components/AppointmentDetailComponents.styles';
import { Appointment } from '@/store/slices/appointmentSlice';

interface DoctorInfoCardProps {
    appointment: Appointment;
    delay?: number;
}

export const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({ appointment, delay = 200 }) => {
    const { theme, isDark } = useTheme();
    const styles = useMemo(() => createAppointmentDetailComponentStyles(theme), [theme]);

    if (!appointment.doctorName) return null;

    return (
        <FadeInView delay={delay} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <User size={20} color={theme.palette.secondary[500]} />
                <Text style={styles.sectionTitle}>Medical Professional</Text>
            </View>

            <View style={[
                styles.infoRow,
                styles.lastInfoRow,
                { paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }
            ]}>
                <View style={[
                    styles.infoIconContainer,
                    {
                        width: 56, height: 56, borderRadius: 20,
                        backgroundColor: isDark ? theme.palette.secondary[900] : theme.palette.secondary[50], // Override for larger avatar
                        marginRight: 16
                    }
                ]}>
                    <User size={28} color={isDark ? theme.palette.secondary[100] : theme.palette.secondary[700]} />
                </View>
                <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: theme.palette.secondary[600], marginBottom: 4 }]}>ASSIGNED DOCTOR</Text>
                    <Text style={[styles.infoValue, { fontSize: 18, marginBottom: 2 }]}>{appointment.doctorName}</Text>
                    {appointment.doctorSpecialization && (
                        <Text style={{ fontSize: 13, color: theme.text.secondary }}>
                            {appointment.doctorSpecialization}
                        </Text>
                    )}
                </View>
            </View>
        </FadeInView>
    );
};
