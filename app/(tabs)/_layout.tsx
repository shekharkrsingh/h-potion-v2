import { Tabs } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { CustomTabBar } from '@/components/navigation/CustomTabBar';

export default function TabLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // Labels are handled in CustomTabBar or hidden for minimalist look
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="booking/index"
                options={{
                    title: 'Bookings',
                }}
            />
            <Tabs.Screen
                name="add/index"
                options={{
                    title: 'Add',
                }}
            />
            <Tabs.Screen
                name="notifications/index"
                options={{
                    title: 'Notifications',
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}
