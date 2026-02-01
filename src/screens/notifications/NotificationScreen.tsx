import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, SectionList, RefreshControl, TouchableOpacity, LayoutAnimation, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isToday, isYesterday, parseISO } from 'date-fns';

import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { Text } from '@/components/ui/Text';
import { AppDispatch, RootState } from '@/store';
import { fetchNotifications, markAsRead, markAllAsRead, Notification } from '@/store/slices/notificationSlice';
import { createStyles } from '@/styles/screens/NotificationScreen.styles';
import { haptics } from '@/utils/haptics';

import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationSkeleton } from '@/components/notifications/NotificationSkeleton';
import { NotificationEmptyState } from '@/components/notifications/NotificationEmptyState';



const NotificationScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const insets = useSafeAreaInsets();
    const { theme, isDark } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const { items: notifications, isLoading, unreadCount } = useSelector((state: RootState) => state.notifications);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Initial Load
    useEffect(() => {
        const load = async () => {
            await dispatch(fetchNotifications());
            setTimeout(() => setIsInitialLoad(false), 500);
        };
        load();
    }, [dispatch]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        haptics.impact();
        await dispatch(fetchNotifications());
        setRefreshing(false);
    }, [dispatch]);

    const handleMarkAllRead = useCallback(() => {
        if (unreadCount > 0) {
            haptics.impact();
            dispatch(markAllAsRead());
        }
    }, [dispatch, unreadCount]);

    const handleToggleItem = useCallback((id: string, isRead: boolean, type?: string) => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.easeInEaseOut },
            delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        });

        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );

        if (!isRead) {
            dispatch(markAsRead(id));
        }

        // Smart Haptics Implementation
        const normalizedType = (type || 'INFO').toUpperCase();
        if (normalizedType === 'UPDATE') {
            haptics.impact();
        } else if (['ALERT', 'EMERGENCY', 'WARNING'].includes(normalizedType)) {
            haptics.error();
        } else {
            haptics.selection();
        }
    }, [dispatch]);

    // --- Grouping Logic ---
    const groupedNotifications = useMemo(() => {
        const groups: { [key: string]: Notification[] } = {
            'Today': [],
            'Yesterday': [],
            'Earlier': []
        };

        notifications.forEach(item => {
            const date = parseISO(item.createdAt);
            if (isToday(date)) {
                groups['Today'].push(item);
            } else if (isYesterday(date)) {
                groups['Yesterday'].push(item);
            } else {
                groups['Earlier'].push(item);
            }
        });

        return [
            { title: 'Today', data: groups['Today'] },
            { title: 'Yesterday', data: groups['Yesterday'] },
            { title: 'Earlier', data: groups['Earlier'] }
        ].filter(section => section.data.length > 0);
    }, [notifications]);

    return (
        <View style={styles.container}>
            <ImageBackground
                source={isDark ? require('@assets/doc_bg_dark.png') : require('@assets/doc_bg_light.png')}
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.safeArea}>
                    {/* Header */}
                    <View style={[styles.header, { paddingTop: insets.top + spacing.xl }]}>
                        <View style={styles.headerTopRow}>
                            <Text style={styles.headerTitle}>Notifications</Text>
                            {unreadCount > 0 && (
                                <TouchableOpacity
                                    onPress={handleMarkAllRead}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text variant="bodySmall" weight="bold" color={theme.palette.primary[500]}>Mark all read</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text variant="bodySmall" color={theme.text.secondary} style={styles.headerSubTitle}>
                            You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                        </Text>
                    </View>

                    {/* Content: Skeleton or List */}
                    {isInitialLoad || (isLoading && notifications.length === 0) ? (
                        <NotificationSkeleton />
                    ) : (
                        <SectionList
                            sections={groupedNotifications}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            renderItem={({ item, index }) => (
                                <NotificationItem
                                    item={item}
                                    index={index}
                                    isExpanded={expandedIds.includes(item.id)}
                                    onToggle={handleToggleItem}
                                />
                            )}
                            renderSectionHeader={({ section: { title } }) => (
                                <View style={styles.sectionHeader}>
                                    <Text variant="bodySmall" weight="bold" color={theme.text.tertiary} style={styles.sectionHeaderText}>
                                        {title}
                                    </Text>
                                </View>
                            )}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={<NotificationEmptyState />}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    colors={[theme.palette.primary[500]]}
                                    tintColor={theme.palette.primary[500]}
                                />
                            }
                            stickySectionHeadersEnabled={false}
                        />
                    )}
                </View>
            </ImageBackground>
        </View>
    );
};

export default NotificationScreen;
