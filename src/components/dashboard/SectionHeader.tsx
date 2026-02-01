import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { spacing } from '@/theme/spacing';
import { ArrowRight } from 'lucide-react-native';
import { haptics } from '@/utils/haptics';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        marginBottom: spacing.m,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
    }
});

interface SectionHeaderProps {
    title: string;
    onActionPress?: () => void;
    actionLabel?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onActionPress, actionLabel = "See All" }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <Text
                variant="h4"
                weight="bold"
                color={theme.palette.primary[500]}
                style={{
                    letterSpacing: 0.3,
                }}
            >
                {title}
            </Text>
            {onActionPress && (
                <TouchableOpacity onPress={() => { haptics.impact(); onActionPress(); }} style={styles.action}>
                    <Text style={styles.actionText} color={theme.text.brand}>{actionLabel}</Text>
                    <ArrowRight size={12} color={theme.text.brand} />
                </TouchableOpacity>
            )}
        </View>
    );
};
