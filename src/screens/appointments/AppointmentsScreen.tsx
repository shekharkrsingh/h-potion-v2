import React, { useState, memo, useRef, useCallback } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    LayoutAnimation,
    Platform,
    ImageBackground,
    Animated,
    FlatList,
} from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { useDialog } from '@/context/DialogContext';
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

const formattedDatesCache = new Map<string, { dateString: string; timeString: string }>();

const getFormattedDateTime = (dateTimeStr: string) => {
    let cached = formattedDatesCache.get(dateTimeStr);
    if (!cached) {
        const date = new Date(dateTimeStr);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        cached = { dateString, timeString };
        formattedDatesCache.set(dateTimeStr, cached);
    }
    return cached;
};

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

interface AppointmentCardProps {
    item: Appointment;
    isExpanded: boolean;
    isDark: boolean;
    theme: any;
    styles: any;
    onToggleExpand: (id: string) => void;
    onViewDetails: (id: string) => void;
}

const AppointmentCard = memo(({
    item,
    isExpanded,
    isDark,
    theme,
    styles,
    onToggleExpand,
    onViewDetails,
}: AppointmentCardProps) => {
    const { dateString, timeString } = getFormattedDateTime(item.appointmentDateTime);

    return (
        <FadeInView delay={100} duration={400} style={styles.resultCard}>
            <ShineView>
                <TouchableOpacity
                    style={styles.cardContent}
                    onPress={() => onViewDetails(item.appointmentId)}
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
                                e.stopPropagation();
                                onToggleExpand(item.appointmentId);
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
                                onPress={() => onViewDetails(item.appointmentId)}
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
}, (prevProps, nextProps) => {
    return (
        prevProps.isExpanded === nextProps.isExpanded &&
        prevProps.isDark === nextProps.isDark &&
        prevProps.item.appointmentId === nextProps.item.appointmentId &&
        prevProps.item.status === nextProps.item.status &&
        prevProps.item.patientName === nextProps.item.patientName &&
        prevProps.item.contact === nextProps.item.contact &&
        prevProps.item.appointmentDateTime === nextProps.item.appointmentDateTime &&
        prevProps.item.appointmentType === nextProps.item.appointmentType
    );
});

const AppointmentsScreen = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const { showDialog, hideDialog } = useDialog();
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

    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [sortBy, setSortBy] = useState('appointmentDateTime');
    const [sortDirection, setSortDirection] = useState('desc');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const dropdownFadeAnim = useRef(new Animated.Value(0)).current;
    const dropdownScaleAnim = useRef(new Animated.Value(0.95)).current;
    const isFetchingRef = useRef(false);

    const toggleSortDropdown = useCallback(() => {
        if (isSortDropdownOpen) {
            Animated.parallel([
                Animated.timing(dropdownFadeAnim, {
                    toValue: 0,
                    duration: 120,
                    useNativeDriver: true,
                }),
                Animated.timing(dropdownScaleAnim, {
                    toValue: 0.95,
                    duration: 120,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setIsSortDropdownOpen(false);
            });
        } else {
            setIsSortDropdownOpen(true);
            dropdownFadeAnim.setValue(0);
            dropdownScaleAnim.setValue(0.95);
            Animated.parallel([
                Animated.timing(dropdownFadeAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(dropdownScaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                })
            ]).start();
        }
        haptics.selection();
    }, [isSortDropdownOpen, dropdownFadeAnim, dropdownScaleAnim]);

    const closeSortDropdown = useCallback((callback: () => void) => {
        Animated.parallel([
            Animated.timing(dropdownFadeAnim, {
                toValue: 0,
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.timing(dropdownScaleAnim, {
                toValue: 0.95,
                duration: 120,
                useNativeDriver: true,
            })
        ]).start(() => {
            setIsSortDropdownOpen(false);
            callback();
        });
    }, [dropdownFadeAnim, dropdownScaleAnim]);

    const toggleCard = useCallback((id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedCardId(prevId => prevId === id ? null : id);
        haptics.selection();
    }, []);

    const fetchSearchResults = useCallback(async (
        pageToFetch: number,
        sortField: string = sortBy,
        sortDir: string = sortDirection,
        isLoadMore: boolean = false
    ) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            const filteredCriteria = Object.fromEntries(
                Object.entries(criteria).filter(([k, v]) => v !== '' && k !== 'maskedContact')
            );

            // Check if at least one filter is provided
            if (Object.keys(filteredCriteria).length === 0) {
                if (!isLoadMore) {
                    showDialog({
                        title: 'No Filters Applied',
                        description: 'Please enter at least one search criterion to find appointments.',
                        primaryAction: { label: 'OK', onPress: hideDialog }
                    });
                }
                return;
            }

            if (isLoadMore) {
                setIsFetchingMore(true);
            }

            const searchParams = {
                ...filteredCriteria,
                page: pageToFetch,
                size: 10,
                sortBy: sortField,
                sortDirection: sortDir,
            };

            const result = await dispatch(searchAppointments(searchParams)).unwrap();

            if (!isLoadMore) {
                haptics.impact();
            }

            if (result.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            if (pageToFetch === 0 && result.length === 0) {
                showDialog({
                    title: 'No Results',
                    description: 'No appointments found matching your search criteria. Try adjusting your filters.',
                    primaryAction: { label: 'OK', onPress: hideDialog }
                });
            }
        } catch (error: any) {
            if (!isLoadMore) {
                haptics.error();
                showDialog({
                    title: 'Search Failed',
                    description: error || 'Unable to search appointments. Please check your connection and try again.',
                    primaryAction: { label: 'OK', onPress: hideDialog }
                });
            } else {
                console.error("Load more failed:", error);
            }
        } finally {
            isFetchingRef.current = false;
            if (isLoadMore) {
                setIsFetchingMore(false);
            }
        }
    }, [dispatch, criteria, sortBy, sortDirection]);

    const handleSearch = useCallback(() => {
        setPage(0);
        setHasMore(true);
        fetchSearchResults(0, sortBy, sortDirection, false);
    }, [fetchSearchResults, sortBy, sortDirection]);

    const handleLoadMore = useCallback(() => {
        if (searchResults.length === 0 || !hasMore || isLoading || isFetchingMore || isFetchingRef.current) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSearchResults(nextPage, sortBy, sortDirection, true);
    }, [searchResults.length, hasMore, isLoading, isFetchingMore, page, fetchSearchResults, sortBy, sortDirection]);

    const clearFilters = useCallback(() => {
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
        setPage(0);
        setHasMore(true);
        setSortBy('appointmentDateTime');
        setSortDirection('desc');
        setIsSortDropdownOpen(false);
        dispatch(clearSearchResults());
        haptics.selection();
    }, [dispatch]);

    useFocusEffect(
        useCallback(() => {
            if (scrollViewRef.current) {
                if (typeof scrollViewRef.current.scrollToOffset === 'function') {
                    scrollViewRef.current.scrollToOffset({ offset: 0, animated: false });
                } else if (typeof scrollViewRef.current.scrollToPosition === 'function') {
                    scrollViewRef.current.scrollToPosition(0, 0, false);
                }
            }
        }, [])
    );

    const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowDatePicker(false);

        if (selectedDate && event.type !== 'dismissed') {
            const dateStr = selectedDate.toISOString().split('T')[0];
            if (showDatePicker) {
                setCriteria(prev => ({ ...prev, [showDatePicker]: dateStr }));
            }
            setShowDatePicker(false);
            haptics.selection();
        } else {
            setShowDatePicker(false);
        }
    }, [showDatePicker]);

    const handleViewDetails = useCallback((id: string) => {
        router.push(`/appointments/details/${id}` as any);
    }, [router]);

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

                    <KeyboardAwareFlatList
                        ref={scrollViewRef}
                        enableOnAndroid={true}
                        extraScrollHeight={100}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        data={isLoading ? [] : searchResults}
                        keyExtractor={(item) => item.appointmentId}
                        ListHeaderComponentStyle={styles.listHeader}
                        renderItem={({ item }) => (
                            <View style={{ paddingHorizontal: spacing.l }}>
                                <AppointmentCard
                                    item={item}
                                    isExpanded={expandedCardId === item.appointmentId}
                                    isDark={isDark}
                                    theme={theme}
                                    styles={styles}
                                    onToggleExpand={toggleCard}
                                    onViewDetails={handleViewDetails}
                                />
                            </View>
                        )}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListHeaderComponent={
                            <View>
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

                                {/* Results Header (rendered inside header) */}
                                {!isLoading && searchResults.length > 0 && (
                                    <View style={[styles.resultsHeader, { marginTop: spacing.xl, paddingHorizontal: spacing.l }]}>
                                        <View style={styles.resultsHeaderLeft}>
                                            <Text style={styles.resultsTitle}>Found Results</Text>
                                            <View style={styles.resultsCount}>
                                                <Text style={styles.resultsCountText}>{searchResults.length}</Text>
                                            </View>
                                        </View>

                                        {/* Backend Sorting Options on Right */}
                                        <View style={styles.sortSection}>
                                            <TouchableOpacity
                                                style={styles.dropdownSelector}
                                                onPress={toggleSortDropdown}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.dropdownSelectorText}>
                                                    {[
                                                        { label: 'Date (Newest)', field: 'appointmentDateTime', dir: 'desc' },
                                                        { label: 'Date (Oldest)', field: 'appointmentDateTime', dir: 'asc' },
                                                        { label: 'Booking Date', field: 'bookingDateTime', dir: 'desc' },
                                                        { label: 'Patient Name (A-Z)', field: 'patientName', dir: 'asc' }
                                                    ].find(o => o.field === sortBy && o.dir === sortDirection)?.label || 'Date (Newest)'}
                                                </Text>
                                                <ChevronDown size={14} color={theme.palette.primary[500]} />
                                            </TouchableOpacity>

                                            {isSortDropdownOpen && (
                                                <Animated.View style={[
                                                    styles.dropdownContainer,
                                                    {
                                                        opacity: dropdownFadeAnim,
                                                        transform: [{ scale: dropdownScaleAnim }]
                                                    }
                                                ]}>
                                                    {[
                                                        { label: 'Date (Newest)', field: 'appointmentDateTime', dir: 'desc' },
                                                        { label: 'Date (Oldest)', field: 'appointmentDateTime', dir: 'asc' },
                                                        { label: 'Booking Date', field: 'bookingDateTime', dir: 'desc' },
                                                        { label: 'Patient Name (A-Z)', field: 'patientName', dir: 'asc' }
                                                    ].map((opt) => {
                                                        const isActive = sortBy === opt.field && sortDirection === opt.dir;
                                                        return (
                                                            <TouchableOpacity
                                                                key={opt.label}
                                                                style={[
                                                                    styles.dropdownItem,
                                                                    isActive && styles.dropdownItemActive
                                                                ]}
                                                                onPress={() => {
                                                                    closeSortDropdown(() => {
                                                                        setSortBy(opt.field);
                                                                        setSortDirection(opt.dir);
                                                                        setPage(0);
                                                                        setHasMore(true);
                                                                        fetchSearchResults(0, opt.field, opt.dir, false);
                                                                    });
                                                                }}
                                                                activeOpacity={0.8}
                                                            >
                                                                <Text style={[
                                                                    styles.dropdownItemText,
                                                                    isActive && styles.dropdownItemTextActive
                                                                ]}>
                                                                    {opt.label}
                                                                </Text>
                                                                {isActive && <Check size={14} color={theme.palette.primary[500]} />}
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </Animated.View>
                                            )}
                                        </View>
                                    </View>
                                )}
                            </View>
                        }
                        ListFooterComponent={
                            <View style={{ paddingBottom: spacing.xl }}>
                                {/* Skeletons if loading */}
                                {isLoading && (
                                    <View style={styles.resultsSection}>
                                        <View style={styles.resultsHeader}>
                                            <Skeleton width={120} height={24} borderRadius={4} />
                                        </View>
                                        {[1, 2, 3].map((i) => (
                                            <AppointmentCardSkeleton key={i} delay={i * 100} />
                                        ))}
                                    </View>
                                )}

                                {/* Loader if fetching more */}
                                {!isLoading && isFetchingMore && (
                                    <View style={styles.footerLoader}>
                                        <ActivityIndicator size="small" color={theme.palette.primary[500]} />
                                    </View>
                                )}
                            </View>
                        }
                        ListEmptyComponent={
                            <View style={styles.resultsSection}>
                                {!isLoading && (
                                    Object.values(criteria).some(v => v !== '') ? (
                                        <View style={styles.emptyState}>
                                            <X size={48} color={theme.text.tertiary} />
                                            <Text style={styles.emptyTitle}>No results found</Text>
                                            <Text style={styles.emptySubtitle}>
                                                Try adjusting your search filters or check for spelling errors.
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.emptyState}>
                                            <Search size={48} color={theme.palette.primary[100]} />
                                            <Text style={styles.emptyTitle}>Start Your Search</Text>
                                            <Text style={styles.emptySubtitle}>
                                                Use the filters above to find specific patient appointments quickly.
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                        }
                    />
                </SafeAreaView>

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
