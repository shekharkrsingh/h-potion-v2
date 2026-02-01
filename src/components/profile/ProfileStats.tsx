import React from 'react';
import { View } from 'react-native';
import { Star, Clock, Users } from 'lucide-react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';

interface ProfileStatsProps {
    experience?: number;
    rating?: number;
    reviewCount?: number;
}

export const ProfileStats = ({ experience, rating, reviewCount }: ProfileStatsProps) => {
    const { theme } = useTheme();
    const styles = createProfileComponentStyles(theme);

    const StatItem = ({ label, value, icon: Icon, color }: any) => (
        <View style={{ alignItems: 'center', flex: 1 }}>
            <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.background.subtle, // using subtle background
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
                borderWidth: 1,
                borderColor: theme.border.subtle
            }}>
                <Icon size={20} color={color} />
            </View>
            <Text variant="h3" weight="bold" color={theme.text.primary}>{value}</Text>
            <Text variant="caption" color={theme.text.secondary}>{label}</Text>
        </View>
    );

    return (
        <View style={styles.sectionContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <StatItem
                    label="Experience"
                    value={`${experience || 0} Yrs`}
                    icon={Clock}
                    color={theme.palette.primary[500]}
                />
                <View style={{ width: 1, height: 40, backgroundColor: theme.border.subtle }} />
                <StatItem
                    label="Rating"
                    value={rating || 'N/A'}
                    icon={Star}
                    color="#fbbf24" // Amber for star
                />
                <View style={{ width: 1, height: 40, backgroundColor: theme.border.subtle }} />
                <StatItem
                    label="Reviews"
                    value={reviewCount || 0}
                    icon={Users}
                    color={theme.palette.secondary[500]}
                />
            </View>
        </View>
    );
};
