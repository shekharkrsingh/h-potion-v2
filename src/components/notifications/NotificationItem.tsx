import React, { useEffect, useRef, memo } from 'react';
import { View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Settings,
    RefreshCw,
    AlertTriangle,
    AlertOctagon,
    Headphones,
    Info,
    ChevronUp
} from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { Notification } from '@/store/slices/notificationSlice';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { createNotificationItemStyles } from '@/styles/components/NotificationItem.styles';
import { ShineView } from '../ui/ShineView';

interface NotificationItemProps {
    item: Notification;
    isExpanded: boolean;
    onToggle: (id: string, isRead: boolean, type?: string) => void;
    index: number;
}

export const NotificationItem = memo(({ item, isExpanded, onToggle, index }: NotificationItemProps) => {
    const { theme } = useTheme();
    const styles = React.useMemo(() => createNotificationItemStyles(theme), [theme]);

    // Entrance Animation
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay: index * 50, // Stagger effect
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 50,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // ... visuals logic remains the same but cleaned up for consistency ...
    const getVisuals = () => {
        const type = (item.type || 'INFO').toUpperCase();
        const getSafeColor = (val: string | undefined, fallback: string) => val || fallback;

        switch (type) {
            case 'SYSTEM':
                return {
                    icon: <Settings size={20} color={!item.isRead ? getSafeColor(theme.palette.neutral[600], '#525252') : getSafeColor(theme.palette.neutral[500], '#737373')} />,
                    gradient: [getSafeColor(theme.palette.neutral[100], '#f5f5f5'), getSafeColor(theme.palette.neutral[200], '#e5e5e5')] as const,
                    style: styles.type_system
                };
            case 'UPDATE':
                return {
                    icon: <RefreshCw size={20} color={!item.isRead ? getSafeColor(theme.palette.primary[600], '#0284c7') : getSafeColor(theme.palette.primary[500], '#0ea5e9')} />,
                    gradient: [getSafeColor(theme.palette.primary[50], '#f0f9ff'), getSafeColor(theme.palette.primary[100], '#e0f2fe')] as const,
                    style: styles.type_update
                };
            case 'ALERT':
                return {
                    icon: <AlertTriangle size={20} color={!item.isRead ? getSafeColor(theme.palette.warning[600], '#d97706') : getSafeColor(theme.palette.warning[500], '#f59e0b')} />,
                    gradient: [getSafeColor(theme.palette.warning[50], '#fffbeb'), getSafeColor(theme.palette.warning[500], '#fef3c7')] as const,
                    style: styles.type_alert
                };
            case 'EMERGENCY':
                return {
                    icon: <AlertOctagon size={20} color={!item.isRead ? getSafeColor(theme.palette.error[600], '#dc2626') : getSafeColor(theme.palette.error[500], '#ef4444')} />,
                    gradient: [getSafeColor(theme.palette.error[50], '#fef2f2'), getSafeColor(theme.palette.error[500], '#fee2e2')] as const,
                    style: styles.type_emergency
                };
            case 'SUPPORT':
                return {
                    icon: <Headphones size={20} color={!item.isRead ? getSafeColor(theme.palette.secondary[600], '#059669') : getSafeColor(theme.palette.secondary[500], '#10b981')} />,
                    gradient: [getSafeColor(theme.palette.secondary[50], '#ecfdf5'), getSafeColor(theme.palette.secondary[100], '#d1fae5')] as const,
                    style: styles.type_support
                };
            case 'INFO':
            default:
                return {
                    icon: <Info size={20} color={!item.isRead ? getSafeColor(theme.palette.info[600], '#2563eb') : getSafeColor(theme.palette.info[500], '#3b82f6')} />,
                    gradient: [getSafeColor(theme.palette.info[50], '#eff6ff'), getSafeColor(theme.palette.info[500], '#dbeafe')] as const,
                    style: styles.type_info
                };
        }
    };

    const visuals = getVisuals();

    const date = new Date(item.createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    let timeText = '';
    if (diffInDays < 7) {
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) {
            timeText = 'Just now';
        } else if (diffInSeconds < 3600) {
            const mins = Math.floor(diffInSeconds / 60);
            timeText = `${mins}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            timeText = `${hours}h ago`;
        } else {
            timeText = `${diffInDays}d ago`;
        }
    } else {
        timeText = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    const IconContainer = () => {
        if (!item.isRead) {
            return (
                <LinearGradient
                    colors={visuals.gradient}
                    style={styles.iconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {visuals.icon}
                </LinearGradient>
            );
        }
        return (
            <View style={styles.iconContainer}>
                {visuals.icon}
            </View>
        );
    };

    return (
        <ShineView style={{ marginBottom: 10, borderRadius: 16 }}>
            <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }}>
                <ScaleButton
                    style={[
                        styles.notificationItem,
                        !item.isRead && visuals.style, // Only show colored border if UNREAD
                        !item.isRead && styles.unreadItem
                    ]}
                    onPress={() => onToggle(item.id, item.isRead, item.type)}
                >
                    <View style={styles.notificationHeaderRow}>
                        <IconContainer />
                        <View style={styles.textContainer}>
                            <View style={styles.unreadTitleRow}>
                                <Text variant="bodyMedium" weight={item.isRead ? 'medium' : 'bold'} color={theme.text.primary} numberOfLines={isExpanded ? undefined : 1} style={{ flex: 1, marginRight: 8 }}>
                                    {item.title}
                                </Text>
                                {!item.isRead && (
                                    <LinearGradient
                                        colors={visuals.gradient}
                                        style={styles.unreadDot}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    />
                                )}
                            </View>
                            <Text style={styles.timeText}>{timeText}</Text>
                        </View>
                    </View>

                    {isExpanded && (
                        <View style={styles.expandedContent}>
                            <Text variant="bodyMedium" color={theme.text.secondary} style={styles.messageFull}>
                                {item.message}
                            </Text>
                            <View style={styles.expandedIconContainer}>
                                <ChevronUp size={16} color={theme.text.tertiary} />
                            </View>
                        </View>
                    )}
                </ScaleButton>
            </Animated.View>
        </ShineView>
    );
});
