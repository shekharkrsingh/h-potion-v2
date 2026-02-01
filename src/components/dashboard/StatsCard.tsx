import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { Text } from '@/components/ui/Text';
import { createStyles, getIconBackground } from '@/styles/components/dashboard/StatsCard.styles';
import { radius } from '@/theme/radius';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { ScalePress } from '@/components/ui/ScalePress';
import { CountUpText } from '@/components/ui/CountUpText';
import { ShineView } from '@/components/ui/ShineView';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    colorKey: 'primary' | 'secondary' | 'info' | 'warning';
    onPress?: () => void;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    shineDelay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    icon,
    colorKey,
    onPress,
    trend,
    shineDelay,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <ShineView style={{ flex: 1, borderRadius: radius.l }} delay={shineDelay}>
            <ScalePress style={styles.card} onPress={onPress}>
                <View style={[styles.iconContainer, { backgroundColor: getIconBackground(colorKey, theme.mode) }]}>
                    {icon}
                </View>

                {(() => {
                    const numericStr = value.toString().replace(/[^0-9.]/g, '');
                    const numericVal = parseFloat(numericStr);
                    const suffix = value.toString().includes('%') ? '%' : '';
                    const prefix = value.toString().includes('$') ? '$' : ''; // Just in case

                    if (!isNaN(numericVal)) {
                        return (
                            <CountUpText
                                value={numericVal}
                                suffix={suffix}
                                prefix={prefix}
                                style={styles.value}
                            />
                        );
                    }
                    return (
                        <Text weight="bold" color={theme.text.primary} style={styles.value}>
                            {value}
                        </Text>
                    );
                })()}
                <Text color={theme.text.secondary} style={styles.label}>
                    {label}
                </Text>

                {trend && (
                    <View style={styles.trendContainer}>
                        {trend.isPositive ? (
                            <TrendingUp size={12} color={theme.status.success} />
                        ) : (
                            <TrendingDown size={12} color={theme.status.error} />
                        )}
                        <Text
                            color={trend.isPositive ? theme.status.success : theme.status.error}
                            style={styles.trendText}
                        >
                            {trend.value}% vs last week
                        </Text>
                    </View>
                )}
            </ScalePress>
        </ShineView>
    );
};
