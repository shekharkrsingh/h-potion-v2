import React, { memo, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { User, Video, MapPin, ChevronRight } from 'lucide-react-native';
import { Appointment } from '@/store/slices/appointmentSlice';
import { Text } from '@/components/ui/Text';
import { ColorTheme } from '@/theme/colors';
import { ShineView } from '../ui/ShineView';

interface BookingCardProps {
    item: Appointment;
    theme: ColorTheme;
    styles: any;
    onPress: (id: string) => void;
}

const BookingCard = ({ item, theme, styles, onPress }: BookingCardProps) => {
    // Defensive check: ensure item exists
    if (!item) return null;

    let timeStr = '--:--';
    try {
        if (item.appointmentDateTime) {
            const date = new Date(item.appointmentDateTime);
            // Check for invalid date
            if (!isNaN(date.getTime())) {
                timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        }
    } catch (e) {
        // Fallback or log error
    }

    const isOnline = item.appointmentType === 'ONLINE';
    const isEmergency = item.isEmergency;
    const isCancelled = item.status === 'CANCELLED';

    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let animation: any = null;

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
            // Stop any running animation and reset to fully opaque
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
        }

        return () => {
            if (animation) {
                animation.stop();
            }
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
                <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
                    <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>Emergency</Text>
                </View>
            );
        }
        if (isCancelled) {
            return (
                <View style={[styles.badge, { backgroundColor: '#64748B' }]}>
                    <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>Cancelled</Text>
                </View>
            );
        }
        return null;
    };

    const getAvatarColor = () => {
        if (isEmergency) return '#EF4444';
        if (isCancelled) return '#64748B';
        return theme.palette.primary[500];
    };

    return (
        <ShineView>
            <TouchableOpacity
                key={item.appointmentId}
                activeOpacity={0.9}
                onPress={() => onPress(item.appointmentId)}
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
                                    <Text style={styles.patientName}>{item.patientName}</Text>
                                    {getStatusBadge()}
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                                    <Text style={styles.appointmentTime}>{timeStr} • {item.appointmentType}</Text>
                                    {isOnline ? (
                                        <Video size={12} color={isCancelled ? '#64748B' : theme.palette.primary[500]} />
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

export default memo(BookingCard);
