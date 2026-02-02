import React, { memo, useEffect, useRef, useMemo } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { User, Video, MapPin, ChevronRight } from 'lucide-react-native';
import { Appointment } from '@/store/slices/appointmentSlice';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { ShineView } from '@/components/ui/ShineView';
import { createStyles } from '@/styles/components/appointments/AppointmentListItem.styles';

interface AppointmentListItemProps {
    appointment: Appointment;
    onPress: (id: string) => void;
}

const AppointmentListItem = ({ appointment, onPress }: AppointmentListItemProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    if (!appointment) return null;

    const timeStr = useMemo(() => {
        try {
            if (appointment.appointmentDateTime) {
                const date = new Date(appointment.appointmentDateTime);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            }
        } catch (e) { }
        return '--:--';
    }, [appointment.appointmentDateTime]);

    const isOnline = appointment.appointmentType === 'ONLINE';
    const isEmergency = appointment.isEmergency;
    const isCancelled = appointment.status === 'CANCELLED';

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let animation: Animated.CompositeAnimation | null = null;

        if (isEmergency) {
            animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.4,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            animation.start();
        } else {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
        }

        return () => {
            if (animation) animation.stop();
            pulseAnim.stopAnimation();
        };
    }, [isEmergency]);

    const cardStyle = [
        styles.bookingCard,
        isEmergency && styles.bookingCardEmergency,
        isCancelled && styles.bookingCardCancelled,
        (!isEmergency && !isCancelled && isOnline) && styles.bookingCardOnline
    ];

    const getStatusBadge = () => {
        if (isEmergency) {
            return (
                <View style={[styles.badge, { backgroundColor: theme.status.error }]}>
                    <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>Emergency</Text>
                </View>
            );
        }
        if (isCancelled) {
            return (
                <View style={[styles.badge, { backgroundColor: theme.palette.neutral[500] }]}>
                    <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>Cancelled</Text>
                </View>
            );
        }
        return null;
    };

    const getAvatarColor = () => {
        if (isEmergency) return theme.status.error;
        if (isCancelled) return theme.palette.neutral[500];
        return theme.palette.primary[500];
    };

    return (
        <ShineView>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onPress(appointment.appointmentId)}
                style={cardStyle}
            >
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <View style={styles.patientInfo}>
                            <Animated.View
                                style={[
                                    styles.avatarContainer,
                                    {
                                        borderColor: getAvatarColor(),
                                        opacity: isEmergency ? pulseAnim : 1
                                    }
                                ]}
                            >
                                <User size={20} color={getAvatarColor()} strokeWidth={2.5} />
                            </Animated.View>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.patientName}>{appointment.patientName}</Text>
                                    {getStatusBadge()}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                                    <Text style={styles.appointmentTime}>{timeStr} • {appointment.appointmentType}</Text>
                                    {isOnline ? (
                                        <Video size={12} color={isCancelled ? theme.palette.neutral[500] : theme.palette.primary[500]} />
                                    ) : (
                                        <MapPin size={12} color={theme.text.tertiary} />
                                    )}
                                </View>
                            </View>
                        </View>
                        <ChevronRight size={20} color={theme.text.tertiary} />
                    </View>
                </View>
            </TouchableOpacity>
        </ShineView>
    );
};

export default memo(AppointmentListItem);
