import React from 'react';
import { View } from 'react-native';
import { Bell } from 'lucide-react-native';

import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createEmptyStateStyles } from '@/styles/components/NotificationEmptyState.styles';

export const NotificationEmptyState = () => {
    const { theme } = useTheme();
    const styles = createEmptyStateStyles(theme);

    return (
        <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIcon}>
                <Bell size={40} color={theme.text.tertiary} />
            </View>
            <Text variant="h3" weight="bold" color={theme.text.primary} style={{ marginBottom: 8 }}>
                All Caught Up!
            </Text>
            <Text variant="bodyMedium" color={theme.text.secondary} align="center">
                You don't have any new notifications at the moment.
            </Text>
        </View>
    );
};
