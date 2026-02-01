import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { FadeInView } from './FadeInView';
import { useTheme } from '@/theme/ThemeContext';

interface VerificationBadgeProps {
    visible: boolean;
    color?: string;
    style?: any;
}

export const VerificationBadge = memo(({ visible, color, style }: VerificationBadgeProps) => {
    const { theme } = useTheme();
    const badgeColor = color || theme.palette.primary[500];

    if (!visible) return null;

    return (
        <FadeInView delay={0} duration={300} style={[styles.container, style]}>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Check size={12} color="#FFF" strokeWidth={3} />
            </View>
        </FadeInView>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 16,
        // Center vertically in a standard Input (height ~56-60)
        // If Input has different height, this might need adjustment via style prop
        top: 20,
        zIndex: 10,
    },
    badge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    }
});
