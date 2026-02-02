import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Appointment } from '@/store/slices/appointmentSlice';
import AppointmentListItem from '@/components/appointments/AppointmentListItem';
import { SectionHeader } from './SectionHeader';
import { createStyles, getSearchGradientColors } from '@/styles/components/dashboard/UpcomingAppointments.styles';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppointmentCardSkeleton } from './DashboardSkeletons';
import { haptics } from '@/utils/haptics';

interface UpcomingAppointmentsProps {
    appointments: Appointment[];
    isLoading?: boolean;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ appointments, isLoading }) => {
    const router = useRouter();
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -5,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [floatAnim]);

    return (
        <View style={styles.container}>
            <SectionHeader
                title="Daily Appointments"
                onActionPress={() => router.push('/appointments')}
            />
            <View style={styles.list}>
                {isLoading ? (
                    [1, 2, 3].map((i) => <AppointmentCardSkeleton key={i} />)
                ) : appointments.length > 0 ? (
                    appointments.map(apt => (
                        <AppointmentListItem
                            key={apt.appointmentId}
                            appointment={apt}
                            onPress={(id: string) => router.push(`/appointments/details/${id}` as any)}
                        />
                    ))
                ) : (
                    <Text align="center" color={theme.text.secondary} style={styles.emptyStateText}>
                        No appointments for today
                    </Text>
                )}

                <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => {
                            haptics.impact();
                            router.push('/appointments' as any);
                        }}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={getSearchGradientColors(theme)}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.searchGradient}
                        />
                        <Search size={22} color="#FFFFFF" />
                        <Text style={styles.searchText}>
                            Search Patients
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};
