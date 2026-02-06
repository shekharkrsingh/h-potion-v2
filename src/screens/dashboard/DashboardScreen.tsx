import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, RefreshControl, View, ImageBackground } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@/theme/ThemeContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { PerformanceMetrics } from '@/components/dashboard/PerformanceMetrics';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Text } from '@/components/ui/Text';
import { FadeInView } from '@/components/ui/FadeInView';
import { AppDispatch, RootState } from '@/store';
import { fetchStatistics } from '@/store/slices/statisticsSlice';
import { fetchAppointments, Appointment as ReduxAppointment } from '@/store/slices/appointmentSlice';
import { fetchProfile } from '@/store/slices/profileSlice';
import { fetchNotifications } from '@/store/slices/notificationSlice';

import { createStyles } from '@/styles/screens/DashboardScreen.styles';
import { getFullImageUrl } from '@/utils/formatters';

export default function DashboardScreen() {
    const { theme, isDark } = useTheme();
    const styles = createStyles(theme, isDark);
    const dispatch = useDispatch<AppDispatch>();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(Date.now());
    const scrollViewRef = useRef<ScrollView>(null);

    // Selectors
    const { data: statsData, isLoading: statsLoading, error: statsError } = useSelector((state: RootState) => state.statistics);
    const { appointments, isLoading: appointmentsLoading } = useSelector((state: RootState) => state.appointments);
    const { data: profile, role: profileRole } = useSelector((state: RootState) => state.profile);
    const { user } = useSelector((state: RootState) => state.auth);
    const { items: notifications, unreadCount } = useSelector((state: RootState) => state.notifications);

    const isCollaborator = (profileRole || user?.role) === 'COLLABORATOR';

    const loadData = useCallback(async (isManualRefresh = false) => {
        const today = new Date().toISOString().split('T')[0];
        await Promise.all([
            dispatch(fetchStatistics()),
            dispatch(fetchAppointments(today)),
            dispatch(fetchProfile()),
            dispatch(fetchNotifications())
        ]);
        if (isManualRefresh) {
            setRefreshKey(Date.now());
        }
    }, [dispatch]);

    useEffect(() => {
        loadData(false);
    }, [loadData]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData(true);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    const userName = profile ? `${profile.firstName} ${profile.lastName}` : (user?.name || 'Doctor');
    const displayAppointments = appointments
        .filter(apt => !apt.treated && (apt.status === 'ACCEPTED' || apt.status === 'REACTIVATED' || apt.status === 'BOOKED'))
        .slice(0, 5);

    const isLoading = statsLoading && !refreshing && !statsData;

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDark ? require('@assets/docbgdark.jpg') : require('@assets/docbglight.jpg')}
                style={styles.background}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.palette.primary[500]}
                        />
                    }
                >
                    <View style={styles.contentWrapper}>
                        <DashboardHeader
                            userName={userName}
                            profileImage={getFullImageUrl(profile?.profilePicture)}
                            notificationCount={unreadCount}
                            transparent={true}
                            workloadSummary={appointments.length > 0 ? `You have ${appointments.length} appointments today` : 'No appointments today'}
                            isCollaborator={isCollaborator}
                        />

                        {statsError && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>Stats Error: {statsError}</Text>
                            </View>
                        )}

                        <FadeInView delay={100} trigger={refreshKey}>
                            <StatsOverview
                                data={statsData || {
                                    totalAppointments: 0,
                                    treatedPatients: 0,
                                    availableHours: 0,
                                    completionRate: 0
                                }}
                                isLoading={isLoading}
                            />
                        </FadeInView>

                        <FadeInView delay={200} trigger={refreshKey}>
                            <PerformanceMetrics statistics={statsData || undefined} isLoading={isLoading} />
                        </FadeInView>

                        <FadeInView delay={300} trigger={refreshKey}>
                            <ChartsSection statistics={statsData || undefined} isLoading={isLoading} />
                        </FadeInView>

                        <FadeInView delay={400} trigger={refreshKey}>
                            <QuickActions isLoading={isLoading} />
                        </FadeInView>

                        <FadeInView delay={500} trigger={refreshKey}>
                            <UpcomingAppointments
                                appointments={displayAppointments}
                                isLoading={isLoading}
                            />
                        </FadeInView>

                        <FadeInView delay={600} trigger={refreshKey}>
                            <RecentActivity notifications={notifications} isLoading={isLoading} />
                        </FadeInView>
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}
