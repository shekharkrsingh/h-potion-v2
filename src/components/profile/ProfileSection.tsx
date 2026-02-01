import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useTheme } from '@/theme/ThemeContext';
import { createProfileComponentStyles } from '@/styles/components/ProfileComponents.styles';

interface ProfileSectionProps {
    title?: string;
    children: React.ReactNode;
}

export const ProfileSection = React.memo(({ title, children }: ProfileSectionProps) => {
    const { theme } = useTheme();
    const styles = React.useMemo(() => createProfileComponentStyles(theme), [theme]);

    return (
        <View style={styles.sectionContainer}>
            {title && (
                <Text
                    variant="h4"
                    weight="bold"
                    color={theme.palette.primary[500]}
                    style={styles.sectionTitle}
                >
                    {title}
                </Text>
            )}
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View >
    );
});
