import React, { useMemo } from 'react';
import { View, Platform } from 'react-native';
import { History, Calendar, Check, MapPin, FileText, CreditCard, XCircle } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { FadeInView } from '@/components/ui/FadeInView';
import { useTheme } from '@/theme/ThemeContext';
import { createAppointmentDetailComponentStyles } from '@/styles/components/AppointmentDetailComponents.styles';
import { Appointment } from '@/store/slices/appointmentSlice';

interface TimelineCardProps {
    appointment: Appointment;
    delay?: number;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ appointment, delay = 400 }) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createAppointmentDetailComponentStyles(theme), [theme]);

    // --- Timeline Data Logic ---
    const timelineData = useMemo(() => {
        const events = [
            { title: 'Booked', date: appointment.bookingDateTime, icon: Calendar, completed: true, color: theme.palette.primary[500] },
            { title: 'Accepted', date: appointment.status !== 'BOOKED' ? appointment.bookingDateTime : null, icon: Check, completed: appointment.status !== 'BOOKED' && appointment.status !== 'CANCELLED', color: theme.status.success },
            { title: 'Payment', date: appointment.paymentStatus ? new Date().toISOString() : null, icon: CreditCard, completed: appointment.paymentStatus, color: theme.status.warning },
            { title: 'Arrived at Clinic', date: appointment.availableAtClinic ? (appointment as any).availableAtClinicDateTime || new Date().toISOString() : null, icon: MapPin, completed: appointment.availableAtClinic, color: theme.palette.secondary[500] },
            { title: 'Treatment', date: appointment.treated ? new Date().toISOString() : null, icon: FileText, completed: appointment.treated, color: theme.palette.primary[600] }
        ];
        if (appointment.status === 'CANCELLED') events.push({ title: 'Cancelled', date: new Date().toISOString(), icon: XCircle, completed: true, color: theme.status.error });

        return events.filter(e => e.date || !e.completed);
    }, [appointment, theme]);

    return (
        <FadeInView delay={delay} style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
                <History size={20} color={theme.text.secondary} />
                <Text style={styles.sectionTitle}>History</Text>
            </View>
            <View style={{ marginTop: 8 }}>
                {timelineData.map((event, index) => (
                    <View key={index} style={styles.timelineItem}>
                        <View style={styles.timelineLeft}>
                            <View style={[styles.timelineDot, { backgroundColor: event.completed ? event.color : theme.palette.neutral[300] }]} />
                            {index < timelineData.length - 1 && (
                                <View style={[styles.timelineLine, { backgroundColor: event.completed ? event.color : theme.palette.neutral[200] }]} />
                            )}
                        </View>
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTitle}>{event.title}</Text>
                            {event.date && (
                                <Text style={styles.timelineTime}>
                                    {Platform.OS === 'ios'
                                        ? new Date(event.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
                                        : new Date(event.date).toTimeString().substring(0, 5)}
                                </Text>
                            )}
                        </View>
                    </View>
                ))}
            </View>
        </FadeInView>
    );
};
