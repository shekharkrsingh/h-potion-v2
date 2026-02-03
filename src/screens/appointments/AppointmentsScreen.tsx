import React, { useState, memo, useRef, useCallback } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    ImageBackground,
    Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Calendar as CalendarIcon, Phone, Hash, ChevronDown, ChevronUp, ChevronRight, X, Clock, Tag, User, ScanLine } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Appointment } from '@/store/slices/appointmentSlice';
import {
    searchAppointments,
    clearSearchResults,
} from '@/store/slices/appointmentSearchSlice';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createStyles } from '@/styles/screens/AppointmentsScreen.styles';
import { haptics } from '@/utils/haptics';
import { getGlassStyle } from '@/styles/common';
import { spacing } from '@/theme/spacing';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AddAppointmentCard } from '@/components/add-appointment/AddAppointmentCard';
import { SelectionChip } from '@/components/add-appointment/SelectionChip';
import { FadeInView } from '@/components/ui/FadeInView';
import { ShineView } from '@/components/ui/ShineView';
import { AppointmentCardSkeleton } from '@/components/appointments/AppointmentCardSkeleton';
import { Check } from 'lucide-react-native';

const formatPhoneNumber = (digits: string) => {
    const clean = digits.replace(/\D/g, '').slice(0, 10);
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
    return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
};

const VerificationBadge = memo(({ visible, styles }: { visible: boolean; styles: any }) => {
    if (!visible) return null;
    return (
        <FadeInView delay={0} duration={300} style={styles.verificationBadgeContainer}>
            <View style={styles.verificationBadge}>
                <Check size={12} color="#FFF" strokeWidth={3} />
            </View>
        </FadeInView>
    );
});

const AppointmentsScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { theme, isDark } = useTheme();
    const styles = createStyles(theme);
    const scrollViewRef = useRef<any>(null);

    const { searchResults, isLoading } = useSelector((state: RootState) => state.appointmentSearch);

    const [criteria, setCriteria] = useState({
        appointmentId: '',
        patientName: '',
        contact: '',
        maskedContact: '',
        appointmentDate: '',
        bookingDate: '',
        status: '',
        appointmentType: '',
    });

    const [showDatePicker, setShowDatePicker] = useState<false | 'appointmentDate' | 'bookingDate'>(false);

    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    const toggleCard = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedCardId(expandedCardId === id ? null : id);
        haptics.selection();
    };

    const handleSearch = async () => {
        try {
            const filteredCriteria = Object.fromEntries(
                Object.entries(criteria).filter(([_, v]) => v !== '')
            );

            // Check if at least one filter is provided
            if (Object.keys(filteredCriteria).length === 0) {
                Alert.alert(
                    'No Filters Applied',
                    'Please enter at least one search criterion to find appointments.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const result = await dispatch(searchAppointments(filteredCriteria)).unwrap();
            haptics.impact();

            // Show success feedback
            if (result.length === 0) {
                Alert.alert(
                    'No Results',
                    'No appointments found matching your search criteria. Try adjusting your filters.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error: any) {
            haptics.error();
            Alert.alert(
                'Search Failed',
                error || 'Unable to search appointments. Please check your connection and try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const clearFilters = () => {
        setCriteria({
            appointmentId: '',
            patientName: '',
            contact: '',
            maskedContact: '',
            appointmentDate: '',
            bookingDate: '',
            status: '',
            appointmentType: '',
        });
        dispatch(clearSearchResults());
        haptics.selection();
    };

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollToPosition(0, 0, false);
        }, [])
    );

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowDatePicker(false);

        if (selectedDate && event.type !== 'dismissed') {
            const dateStr = selectedDate.toISOString().split('T')[0];
            if (showDatePicker) {
                setCriteria(prev => ({ ...prev, [showDatePicker]: dateStr }));
            }
            if (Platform.OS === 'ios' && showDatePicker) {
                // Keep it open on iOS if needed, or close it? usually better to close on selection if not inline
            }
            setShowDatePicker(false);
            haptics.selection();
        } else {
            setShowDatePicker(false);
        }
    };



    const renderResultCard = (item: Appointment) => {
        const isExpanded = expandedCardId === item.appointmentId;
        const date = new Date(item.appointmentDateTime);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        return (
            <FadeInView key={item.appointmentId} delay={100} duration={400} style={styles.resultCard}>
                <ShineView>
                    <TouchableOpacity
                        style={styles.cardContent}
                        onPress={() => router.push(`/appointments/details/${item.appointmentId}` as any)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.cardHeaderLeft}>
                                <View style={styles.avatarContainer}>
                                    <User size={24} color={theme.palette.primary[500]} strokeWidth={2.5} />
                                </View>
                                <View style={styles.patientInfo}>
                                    <Text style={styles.patientName}>
                                        {item.patientName}
                                    </Text>
                                    <Text variant="caption" style={styles.patientId}>
                                        #{item.appointmentId}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.cardHeaderRight}>
                                <StatusBadge status={item.status} theme={theme} isDark={isDark} />
                                <TouchableOpacity onPress={(e) => {
                                    e.stopPropagation(); // Prevent card nav
                                    toggleCard(item.appointmentId);
                                }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    {isExpanded ?
                                        <ChevronUp size={22} color={theme.palette.primary[500]} strokeWidth={2.5} /> :
                                        <ChevronDown size={22} color={theme.text.tertiary} strokeWidth={2.5} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {isExpanded && (
                            <View style={styles.cardDetails}>
                                <View style={styles.detailGrid}>
                                    <View style={styles.detailRow}>
                                        <CalendarIcon size={16} color={theme.text.tertiary} />
                                        <Text variant="bodySmall" color={theme.text.secondary} style={styles.detailLabel}>Date:</Text>
                                        <Text variant="bodySmall" color={theme.text.primary}>{dateString}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Clock size={16} color={theme.text.tertiary} />
                                        <Text variant="bodySmall" color={theme.text.secondary} style={styles.detailLabel}>Time:</Text>
                                        <Text variant="bodySmall" color={theme.text.primary}>{timeString}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Phone size={16} color={theme.text.tertiary} />
                                        <Text variant="bodySmall" color={theme.text.secondary} style={styles.detailLabel}>Contact:</Text>
                                        <Text variant="bodySmall" color={theme.text.primary}>{formatPhoneNumber(item.contact)}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Hash size={16} color={theme.text.tertiary} />
                                        <Text variant="bodySmall" color={theme.text.secondary} style={styles.detailLabel}>Type:</Text>
                                        <Text variant="bodySmall" color={theme.text.primary}>{item.appointmentType}</Text>
                                    </View>
                                </View>

                                <Button
                                    title="View Full Details"
                                    onPress={() => router.push(`/appointments/details/${item.appointmentId}` as any)}
                                    variant="outline"
                                    size="sm"
                                    style={styles.viewDetailsButton}
                                    rightIcon={<ChevronRight size={16} color={theme.palette.primary[500]} />}
                                />
                            </View>
                        )}
                    </TouchableOpacity>
                </ShineView>
            </FadeInView>
        );
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDark ? require('@assets/docbgdark.jpg') : require('@assets/docbglight.jpg')}
                style={styles.background}
            >
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.header}>
                        <View style={styles.headerTopRow}>
                            <View>
                                <Text style={styles.headerTitle} color={theme.text.primary}>Search Appointments</Text>
                                <Text style={styles.headerSubtitle} color={theme.text.secondary}>Manage and search patient bookings</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    haptics.impact();
                                    router.push('/qr/scanner' as any);
                                }}
                                style={styles.qrButton}
                            >
                                <ScanLine size={24} color={theme.palette.primary[500]} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <KeyboardAwareScrollView
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        enableOnAndroid={true}
                        enableAutomaticScroll={true}
                        extraScrollHeight={20}
                    >
                        {/* Search Panel */}
                        <AddAppointmentCard isDark={isDark} theme={theme} delay={100} style={styles.searchSection}>
                            <View style={styles.searchTitleRow}>
                                <Filter size={20} color={theme.palette.primary[500]} />
                                <Text variant="h4" style={styles.searchTitle}>Search Criteria</Text>
                                <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
                                    <Text variant="caption" color={theme.palette.primary[500]} style={styles.clearButtonText}>
                                        Clear All
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.grid}>
                                <View>
                                    <Input
                                        placeholder="Patient Name"
                                        leftIcon={<Search size={18} color={theme.text.tertiary} />}
                                        value={criteria.patientName}
                                        onChangeText={(text) => setCriteria(prev => ({ ...prev, patientName: text }))}
                                    />
                                    <VerificationBadge visible={criteria.patientName.length > 2} styles={styles} />
                                </View>

                                <View style={styles.fieldWrapper}>
                                    <Input
                                        placeholder="Phone Number"
                                        leftIcon={<Phone size={18} color={theme.text.tertiary} />}
                                        keyboardType="phone-pad"
                                        value={criteria.maskedContact}
                                        onChangeText={(t) => {
                                            const clean = t.replace(/\D/g, '').slice(0, 10);
                                            setCriteria(prev => ({
                                                ...prev,
                                                contact: clean,
                                                maskedContact: formatPhoneNumber(clean)
                                            }));
                                        }}
                                        maxLength={14}
                                    />
                                    <VerificationBadge visible={criteria.contact.length === 10} styles={styles} />
                                </View>

                                <View style={styles.fieldWrapper}>
                                    <Input
                                        placeholder="Appt ID"
                                        leftIcon={<Hash size={18} color={theme.text.tertiary} />}
                                        value={criteria.appointmentId}
                                        onChangeText={(text) => setCriteria(prev => ({ ...prev, appointmentId: text }))}
                                    />
                                    <VerificationBadge visible={criteria.appointmentId.length > 0} styles={styles} />
                                </View>

                                <View style={styles.row}>
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker('appointmentDate')}
                                        style={styles.datePickerButton}
                                    >
                                        <View style={styles.datePickerContent}>
                                            <CalendarIcon size={18} color={theme.text.tertiary} />
                                            <Text color={criteria.appointmentDate ? theme.text.primary : theme.text.tertiary}>
                                                {criteria.appointmentDate || 'Appt Date'}
                                            </Text>
                                        </View>
                                        <ChevronDown size={14} color={theme.text.tertiary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setShowDatePicker('bookingDate')}
                                        style={styles.datePickerButton}
                                    >
                                        <View style={styles.datePickerContent}>
                                            <Clock size={18} color={theme.text.tertiary} />
                                            <Text color={criteria.bookingDate ? theme.text.primary : theme.text.tertiary}>
                                                {criteria.bookingDate || 'Book Date'}
                                            </Text>
                                        </View>
                                        <ChevronDown size={14} color={theme.text.tertiary} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.statusSection}>
                                    <Text style={styles.sectionLabel}>Status</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                                        {['All', 'ACCEPTED', 'PENDING', 'CANCELLED', 'MISSED', 'REACTIVATED', 'TREATED'].map(s => (
                                            <SelectionChip
                                                key={s}
                                                label={s === 'All' ? 'Any Status' : s.charAt(0) + s.slice(1).toLowerCase()}
                                                active={criteria.status === (s === 'All' ? '' : s)}
                                                onPress={() => {
                                                    haptics.selection();
                                                    setCriteria(prev => ({ ...prev, status: s === 'All' ? '' : s }));
                                                }}
                                                isDark={isDark}
                                                theme={theme}
                                            />
                                        ))}
                                    </ScrollView>
                                </View>

                                <View>
                                    <Text style={styles.sectionLabel}>Appointment Type</Text>
                                    <View style={styles.chipsContainer}>
                                        {['All', 'IN_PERSON', 'ONLINE'].map(t => (
                                            <SelectionChip
                                                key={t}
                                                label={t === 'All' ? 'Any Type' : t.replace('_', ' ').charAt(0) + t.replace('_', ' ').slice(1).toLowerCase()}
                                                active={criteria.appointmentType === (t === 'All' ? '' : t)}
                                                onPress={() => {
                                                    haptics.selection();
                                                    setCriteria(prev => ({ ...prev, appointmentType: t === 'All' ? '' : t }));
                                                }}
                                                isDark={isDark}
                                                theme={theme}
                                            />
                                        ))}
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={handleSearch}
                                    disabled={isLoading}
                                    activeOpacity={0.8}
                                    style={styles.searchButton}
                                >
                                    <LinearGradient
                                        colors={isDark
                                            ? [theme.palette.primary[600], theme.palette.primary[800]]
                                            : [theme.palette.primary[400], theme.palette.primary[600]]
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.searchButtonGradient}
                                    />
                                    {isLoading ? (
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                    ) : (
                                        <>
                                            <Search size={22} color="#FFFFFF" strokeWidth={2.5} />
                                            <Text style={styles.searchButtonText}>
                                                Search Appointments
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </AddAppointmentCard>

                        {/* Results */}
                        <View style={styles.resultsSection}>
                            {isLoading ? (
                                <>
                                    <View style={styles.resultsHeader}>
                                        <Skeleton width={120} height={24} borderRadius={4} />
                                    </View>
                                    {[1, 2, 3].map((i) => (
                                        <AppointmentCardSkeleton key={i} delay={i * 100} />
                                    ))}
                                </>
                            ) : searchResults.length > 0 ? (
                                <>
                                    <View style={styles.resultsHeader}>
                                        <Text style={styles.resultsTitle}>Found Results</Text>
                                        <View style={styles.resultsCount}>
                                            <Text style={styles.resultsCountText}>{searchResults.length}</Text>
                                        </View>
                                    </View>
                                    {searchResults.map(renderResultCard)}
                                </>
                            ) : criteria.patientName && !isLoading ? (
                                <View style={styles.emptyState}>
                                    <X size={48} color={theme.text.tertiary} />
                                    <Text style={styles.emptyTitle}>No results found</Text>
                                    <Text style={styles.emptySubtitle}>
                                        Try adjusting your search filters or check for spelling errors.
                                    </Text>
                                </View>
                            ) : !isLoading && (
                                <View style={styles.emptyState}>
                                    <Search size={48} color={theme.palette.primary[100]} />
                                    <Text style={styles.emptyTitle}>Start Your Search</Text>
                                    <Text style={styles.emptySubtitle}>
                                        Use the filters above to find specific patient appointments quickly.
                                    </Text>
                                </View>
                            )}
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView >

                {showDatePicker && (
                    <DateTimePicker
                        value={criteria[showDatePicker] ? new Date(criteria[showDatePicker]) : new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                    />
                )}
            </ImageBackground >
        </View >
    );
};

export default AppointmentsScreen;
