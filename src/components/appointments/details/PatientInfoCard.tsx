import React, { useMemo } from 'react';
import { View } from 'react-native';
import { User, Calendar, Phone, CreditCard, Video, Building2 } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { FadeInView } from '@/components/ui/FadeInView';
import { useTheme } from '@/theme/ThemeContext';
import { createAppointmentDetailComponentStyles } from '@/styles/components/AppointmentDetailComponents.styles';
import { Appointment } from '@/store/slices/appointmentSlice';

interface PatientInfoCardProps {
    appointment: Appointment;
    delay?: number;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ appointment, delay = 100 }) => {
    const { theme, isDark } = useTheme();
    const styles = useMemo(() => createAppointmentDetailComponentStyles(theme), [theme]);

    // Formatting
    const date = new Date(appointment.appointmentDateTime);
    const dateStr = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

    return (
        <FadeInView delay={delay} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <User size={20} color={theme.palette.primary[500]} />
                <Text style={styles.sectionTitle}>Patient Information</Text>
            </View>

            {/* Date */}
            <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                    <Calendar size={20} color={theme.palette.primary[500]} />
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Date & Time</Text>
                    <Text style={styles.infoValue}>
                        {dateStr} • {timeStr}
                    </Text>
                </View>
            </View>

            {/* Consultation Type (Booking Mode) */}
            <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                    {appointment.appointmentType === 'ONLINE' ? (
                        <Video size={20} color={theme.palette.primary[500]} />
                    ) : (
                        <Building2 size={20} color={theme.palette.primary[500]} />
                    )}
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Consultation Type</Text>
                    <Text style={styles.infoValue}>
                        {appointment.appointmentType === 'ONLINE' ? 'Online Consultation' : 'In-Person Visit'}
                    </Text>
                </View>
            </View>

            {/* Contact */}
            <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                    <Phone size={20} color={theme.palette.primary[500]} />
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Contact</Text>
                    <Text style={styles.infoValue}>{appointment.contact || 'Not provided'}</Text>
                </View>
            </View>

            {/* Payment */}
            <View style={[styles.infoRow, styles.lastInfoRow]}>
                <View style={[styles.infoIconContainer, { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : '#DCFCE7' }]}>
                    <CreditCard size={20} color={theme.status.success} />
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Payment Status</Text>
                    <Text style={[styles.infoValue, { color: appointment.paymentStatus ? theme.status.success : theme.status.error }]}>
                        {appointment.paymentStatus ? 'Payment Completed' : 'Payment Pending'}
                    </Text>
                </View>
            </View>
        </FadeInView>
    );
};
