import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { createStyles, getIconBoxBackground } from '@/styles/components/dashboard/QuickActions.styles';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { CirclePlus, Calendar, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { haptics } from '@/utils/haptics';
import { ScalePress } from '@/components/ui/ScalePress';
import { FadeInView } from '@/components/ui/FadeInView';
import { ShineView } from '@/components/ui/ShineView';
import { radius } from '@/theme/radius';

import { QuickActionsSkeleton } from './DashboardSkeletons';

interface ActionItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    route: string;
    colorKey: 'primary' | 'secondary' | 'warning' | 'info';
}

interface QuickActionsProps {
    isLoading?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ isLoading }) => {
    const { theme } = useTheme();
    const router = useRouter();
    const styles = createStyles(theme);

    if (isLoading) return <QuickActionsSkeleton />;

    const actions: ActionItem[] = [
        {
            id: '1',
            label: 'Add Appt',
            icon: <CirclePlus size={24} color={theme.palette.primary[600]} />,
            route: '/add',
            colorKey: 'primary',
        },
        {
            id: '2',
            label: 'My Bookings',
            icon: <Calendar size={24} color={theme.palette.secondary[600]} />,
            route: '/booking',
            colorKey: 'secondary',
        },
        {
            id: '3',
            label: 'Reports',
            icon: <FileText size={24} color={theme.palette.info[600]} />,
            route: '/resources/reports',
            colorKey: 'info',
        },
    ];

    return (
        <View style={styles.container}>
            <SectionHeader title="Quick Actions" />
            <ShineView style={{ borderRadius: radius.l }}>
                <View style={styles.grid}>
                    {actions.map((action, index) => (
                        <View
                            key={action.id}
                            style={styles.actionItem}
                        >
                            <ScalePress
                                onPress={() => router.push(action.route as any)}
                            >
                                <View style={[styles.iconBox, {
                                    backgroundColor: getIconBoxBackground(action.colorKey, theme.mode)
                                }]}>
                                    {action.icon}
                                </View>
                                <Text style={styles.label} color={theme.text.primary} numberOfLines={2}>
                                    {action.label}
                                </Text>
                            </ScalePress>
                        </View>
                    ))}
                </View>
            </ShineView>
        </View>
    );
};
