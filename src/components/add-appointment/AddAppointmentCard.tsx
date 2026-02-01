import React, { memo } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { FadeInView } from '@/components/ui/FadeInView';
import { ColorTheme } from '@/theme/colors';

interface AddAppointmentCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    delay?: number;
    isDark: boolean;
    theme: ColorTheme;
}

export const AddAppointmentCard = memo(({ children, style, delay = 0, isDark, theme }: AddAppointmentCardProps) => (
    <FadeInView delay={delay} style={[
        {
            backgroundColor: isDark ? 'rgba(20, 20, 25, 0.85)' : 'rgba(255, 255, 255, 0.95)',
            borderColor: theme.border.subtle,
            borderWidth: 1,
            borderRadius: 24, // Explicitly standardizing on 24
            padding: 20,
        },
        style
    ]}>
        {children}
    </FadeInView>
));
