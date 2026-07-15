import React, { useEffect } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyles } from '@/styles/components/navigation/CustomTabBar.styles';
import { Text } from '@/components/ui/Text';
import { ScalePress } from '@/components/ui/ScalePress';
import {
    LayoutDashboard,
    Calendar,
    CirclePlus,
    Bell,
    CircleUserRound
} from 'lucide-react-native';
import { haptics } from '@/utils/haptics';

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const styles = createStyles(theme, insets.bottom);
    const { unreadCount } = useSelector((state: RootState) => state.notifications);

    const icons: Record<string, { icon: any; label: string }> = {
        index: { icon: LayoutDashboard, label: 'Home' },
        'booking/index': { icon: Calendar, label: 'Bookings' },
        'add/index': { icon: CirclePlus, label: 'Add' },
        'notifications/index': { icon: Bell, label: 'Alerts' },
        'profile/index': { icon: CircleUserRound, label: 'Profile' },
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    // Skip hidden tabs or routes without defined icons
                    if ((options as any).href === null || !icons[route.name]) {
                        return null;
                    }

                    const onPress = () => {
                        haptics.impact();
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const { icon: Icon, label } = icons[route.name];
                    const isActionButton = route.name === 'add/index';

                    if (isActionButton) {
                        return (
                            <View key={route.key} style={styles.tabItem}>
                                <ScalePress
                                    onPress={onPress}
                                    style={styles.actionButtonContainer}
                                >
                                    <Icon size={24} color="#fff" strokeWidth={2.5} />
                                </ScalePress>
                                <Text
                                    style={[styles.label, { color: isFocused ? theme.text.primary : theme.text.secondary }]}
                                >
                                    {label}
                                </Text>
                            </View>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <View style={{ position: 'relative' }}>
                                <Icon
                                    size={22}
                                    color={isFocused ? theme.icon.active : theme.icon.default}
                                    strokeWidth={isFocused ? 2.5 : 2}
                                />
                                {route.name === 'notifications/index' && unreadCount > 0 && (
                                    <View style={{
                                        position: 'absolute',
                                        top: -6,
                                        right: -8,
                                        backgroundColor: theme.status.error,
                                        minWidth: 18,
                                        height: 18,
                                        borderRadius: 9,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingHorizontal: 4,
                                        borderWidth: 1.5,
                                        borderColor: theme.mode === 'dark' ? '#1E293B' : '#FFFFFF'
                                    }}>
                                        <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold', textAlign: 'center', lineHeight: 12 }}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                                    </View>
                                )}
                            </View>
                            <Text
                                style={[styles.label, { color: isFocused ? theme.icon.active : theme.icon.default }]}
                            >
                                {label}
                            </Text>
                            {isFocused && <View style={styles.indicator} />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
