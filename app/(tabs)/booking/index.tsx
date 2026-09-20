import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    RefreshControl,
    TextInput,
    Animated,
    Platform,
    LayoutAnimation,
    Modal
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme/spacing';
import {
    ClipboardCheck,
    Video,
    MapPin,
    Wifi,
    ScanLine,
    Search,
    Filter,
    XCircle,
    AlertCircle,
    Trash2
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useFocusEffect } from 'expo-router';
import { AppDispatch, RootState } from '@/store';
import {
    fetchAppointments,
    Appointment
} from '@/store/slices/appointmentSlice';
import {
    searchAppointments,
    clearSearchResults
} from '@/store/slices/appointmentSearchSlice';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { createStyles } from '@/styles/screens/BookingScreen.styles';
import { haptics } from '@/utils/haptics';
import AppointmentListItem from '@/components/appointments/AppointmentListItem';
import { BookingListSkeleton } from '@/components/booking/BookingSkeletons';
import { BookingFilterModal } from '@/components/booking/BookingFilterModal';
import { websocketAppointment } from '@/services/websocket/websocketService';

// Separate Header for better performance
const BookingHeader = React.memo(({ theme, isDark, isSearchVisible, setIsSearchVisible, searchQuery, setSearchQuery, searchAnim, inputRef }: any) => {
    const styles = useMemo(() => createStyles(theme), [theme]);
    const router = useRouter();

    return (
        <View style={styles.header}>
            <View style={styles.headerTopRow}>
                <Text style={styles.headerTitle}>Bookings</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => {
                            haptics.selection();
                            setIsSearchVisible(!isSearchVisible);
                            if (!isSearchVisible) {
                                // Clear query when closing
                            } else {
                                setSearchQuery('');
                            }
                        }}
                        style={[
                            styles.iconButton,
                            {
                                backgroundColor: isSearchVisible
                                    ? theme.palette.primary[500]
                                    : theme.background.card
                            }
                        ]}
                    >
                        <Search size={20} color={isSearchVisible ? '#FFF' : theme.palette.primary[500]} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            haptics.impact();
                            router.push('/qr/scanner' as any);
                        }}
                        style={[styles.iconButton, { backgroundColor: theme.background.card }]}
                    >
                        <ScanLine size={20} color={theme.palette.primary[500]} />
                    </TouchableOpacity>
                </View>
            </View>
            <Animated.View style={[
                styles.searchContainer,
                {
                    marginTop: searchAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 8]
                    }),
                    height: searchAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 48]
                    }),
                    opacity: searchAnim,
                    overflow: 'hidden',
                    paddingVertical: 0,
                    borderWidth: searchAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ]}>
                <Search size={20} color={theme.text.secondary} style={styles.searchIcon} />
                <TextInput
                    ref={inputRef}
                    style={styles.searchInput}
                    placeholder="Search by name or ID..."
                    placeholderTextColor={theme.text.tertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <XCircle size={18} color={theme.text.tertiary} />
                    </TouchableOpacity>
                )}
            </Animated.View>
        </View>
    );
});

// Separate FilterSection for better performance
const BookingFilterSection = React.memo(({ activeFilter, setActiveFilter, isAdvancedFilterActive, getDynamicFilterLabel, toggleFilterModal, theme, CustomLayoutAnimation }: any) => {
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <View style={styles.filterSection}>
            <View style={styles.filterScrollView}>
                {(['available', 'treated', 'all'] as const).map(filter => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterChip,
                            activeFilter === filter && styles.activeFilterChip
                        ]}
                        onPress={() => {
                            LayoutAnimation.configureNext(CustomLayoutAnimation);
                            setActiveFilter(filter);
                            haptics.selection();
                        }}
                    >
                        <Text style={[
                            styles.filterText,
                            activeFilter === filter && styles.activeFilterText
                        ]}>
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        isAdvancedFilterActive && styles.activeFilterChip,
                        { flexDirection: 'row', alignItems: 'center', gap: 6 }
                    ]}
                    onPress={() => {
                        toggleFilterModal(true);
                        haptics.impact();
                    }}
                >
                    <Filter size={16} color={isAdvancedFilterActive ? '#FFF' : theme.text.secondary} />
                    <Text style={[
                        styles.filterText,
                        isAdvancedFilterActive && styles.activeFilterText
                    ]}>
                        {activeFilter === 'all' || activeFilter === 'available' || activeFilter === 'treated'
                            ? 'Filter'
                            : getDynamicFilterLabel()}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const BookingScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const { appointments, isLoading } = useSelector((state: RootState) => state.appointments);
    const { searchResults, isLoading: isSearchLoading } = useSelector((state: RootState) => state.appointmentSearch);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'treated' | 'emergency' | 'cancelled' | 'in-person' | 'online' | 'pending'>('available');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Debounce search query to prevent excessive re-filtering
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedSearchQuery.trim() === '') {
            dispatch(clearSearchResults());
            return;
        }

        const query = debouncedSearchQuery.trim();
        const searchCriteria: any = {
            appointmentDate: new Date().toISOString().split('T')[0], // Only today's appointments
            page: 0,
            size: 100,
            sortBy: 'appointmentDateTime',
            sortDirection: 'desc'
        };

        const cleanNumbers = query.replace(/\D/g, '');
        
        if (query.includes('@')) {
            searchCriteria.email = query;
        } else if (query.includes('-') && /^[A-Za-z0-9-]+$/.test(query)) {
            // Has hyphens and is alphanumeric (e.g., UUID or APT-123)
            searchCriteria.appointmentId = query;
        } else if (/^[A-Za-z0-9]+$/.test(query) && /[a-zA-Z]/.test(query) && /[0-9]/.test(query)) {
            // Alphanumeric with no spaces/hyphens (e.g., APT123)
            searchCriteria.appointmentId = query;
        } else if (!/[a-zA-Z]/.test(query)) {
            if (cleanNumbers.length > 10) {
                // More than 10 digits, definitely a contact with country code
                searchCriteria.contact = cleanNumbers.slice(-10);
            } else {
                // Digits <= 10: Could be an appointment ID or a full/partial contact number.
                // We'll search both by passing an array of criteria.
                const criteriaForId = { ...searchCriteria, appointmentId: query };
                const criteriaForContact = { ...searchCriteria, contact: cleanNumbers };
                dispatch(searchAppointments([criteriaForId, criteriaForContact]));
                return; // Early return to avoid dispatching the single criteria below
            }
        } else {
            // Has letters and spaces, likely a patient name
            searchCriteria.patientName = query;
        }

        dispatch(searchAppointments(searchCriteria));
    }, [debouncedSearchQuery, dispatch]);

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const searchAnim = useRef(new Animated.Value(0)).current;
    const inputRef = useRef<TextInput>(null);
    const flatListRef = useRef<any>(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(searchAnim, {
            toValue: isSearchVisible ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();

        if (isSearchVisible) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            inputRef.current?.blur();
        }
    }, [isSearchVisible]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        requestAnimationFrame(() => {
            dispatch(fetchAppointments());
        });
    }, [dispatch]);

    const CustomLayoutAnimation = useMemo(() => ({
        duration: 300,
        create: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
        update: {
            type: LayoutAnimation.Types.easeInEaseOut,
        },
        delete: {
            type: LayoutAnimation.Types.easeInEaseOut,
            property: LayoutAnimation.Properties.opacity,
        },
    }), []);


    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                loadData(),
                websocketAppointment.ensureConnected()
            ]);
        } catch (error) {
            console.error('[Booking] Refresh failed:', error);
        } finally {
            setRefreshing(false);
            haptics.selection();
        }
    };

    useFocusEffect(
        useCallback(() => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
        }, [])
    );

    const filteredAppointments = useMemo(() => {
        const sourceList = debouncedSearchQuery.trim() !== '' ? searchResults : appointments;

        return sourceList.filter(apt => {
            // Hide cancelled appointments from all views except when explicitly filtered by 'cancelled'
            if (activeFilter !== 'cancelled' && apt.status === 'CANCELLED') {
                return false;
            }

            const matchesFilter = activeFilter === 'all'
                ? true
                : activeFilter === 'available' ? !apt.treated && apt.availableAtClinic
                    : activeFilter === 'treated' ? apt.treated
                        : activeFilter === 'emergency' ? apt.isEmergency
                            : activeFilter === 'cancelled' ? apt.status === 'CANCELLED'
                                : activeFilter === 'pending' ? !apt.treated && apt.status !== 'CANCELLED' && !apt.availableAtClinic
                                    : activeFilter === 'in-person' ? apt.appointmentType === 'IN_PERSON'
                                        : activeFilter === 'online' ? apt.appointmentType === 'ONLINE'
                                            : true;

            // Search filtering is now done on the backend, so we just apply the status filters
            return matchesFilter;
        });
    }, [appointments, searchResults, activeFilter, debouncedSearchQuery]);

    const getDynamicFilterLabel = useCallback(() => {
        if (activeFilter === 'emergency') return 'Emergency';
        if (activeFilter === 'cancelled') return 'Cancelled';
        if (activeFilter === 'in-person') return 'In-Person';
        if (activeFilter === 'online') return 'Online';
        if (activeFilter === 'pending') return 'Pending';
        return 'Filter';
    }, [activeFilter]);

    const isAdvancedFilterActive = useMemo(() =>
        ['emergency', 'cancelled', 'in-person', 'online', 'pending'].includes(activeFilter),
        [activeFilter]);

    // Optimized navigation handler
    const handleCardPress = useCallback((id: string) => {
        router.push({ pathname: '/appointments/details/[id]', params: { id } });
    }, [router]);

    // Render item function for FlatList
    const renderItem = useCallback(({ item }: { item: Appointment }) => (
        <AppointmentListItem
            appointment={item}
            onPress={handleCardPress}
        />
    ), [handleCardPress]);

    const toggleFilterModal = useCallback((show: boolean) => {
        setShowFilterModal(show);
    }, []);

    const getItemLayout = useCallback((data: any, index: number) => ({
        length: 120, // Estimated height including margin
        offset: 120 * index,
        index,
    }), []);

    // Scroll interpolation removed scrollY ref from here as it is now at top level

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.95],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const filterTranslateY = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -10],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDark ? require('@assets/docbgdark.jpg') : require('@assets/docbglight.jpg')}
                style={styles.background}
            >
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    <Animated.View style={{ opacity: headerOpacity, transform: [{ scale: headerHeight }] }}>
                        <BookingHeader
                            theme={theme}
                            isDark={isDark}
                            isSearchVisible={isSearchVisible}
                            setIsSearchVisible={setIsSearchVisible}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            searchAnim={searchAnim}
                            inputRef={inputRef}
                        />
                    </Animated.View>

                    <Animated.View style={{ transform: [{ translateY: filterTranslateY }] }}>
                        <BookingFilterSection
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                            isAdvancedFilterActive={isAdvancedFilterActive}
                            getDynamicFilterLabel={getDynamicFilterLabel}
                            toggleFilterModal={toggleFilterModal}
                            theme={theme}
                            CustomLayoutAnimation={CustomLayoutAnimation}
                        />
                    </Animated.View>
                    {/* List */}
                    {(isLoading || isSearchLoading) && !refreshing && filteredAppointments.length === 0 ? (
                        <BookingListSkeleton />
                    ) : (
                        <Animated.FlatList
                            ref={flatListRef}
                            data={filteredAppointments}
                            renderItem={renderItem}
                            keyExtractor={item => item.appointmentId}
                            contentContainerStyle={[styles.scrollContent, { paddingTop: spacing.s }]}
                            showsVerticalScrollIndicator={false}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )}
                            scrollEventThrottle={16}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.palette.primary[500]} />
                            }
                            initialNumToRender={8}
                            maxToRenderPerBatch={10}
                            windowSize={5}
                            removeClippedSubviews={Platform.OS === 'android'}
                            getItemLayout={getItemLayout}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <ClipboardCheck size={64} color={theme.palette.primary[100]} strokeWidth={1.5} />
                                    <Text style={styles.emptyTitle}>No bookings found</Text>
                                    <Text style={styles.emptySubtitle}>
                                        {activeFilter === 'all'
                                            ? "You don't have any appointments scheduled for today yet."
                                            : `No appointments match the "${activeFilter}" filter selection.`}
                                    </Text>
                                </View>
                            }
                        />
                    )}

                    <BookingFilterModal
                        visible={showFilterModal}
                        onClose={() => toggleFilterModal(false)}
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        theme={theme}
                        isDark={isDark}
                        styles={styles}
                        insets={insets}
                    />
                </SafeAreaView>
            </ImageBackground>
        </View >
    );
};

export default BookingScreen;
