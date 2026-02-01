import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';

// We use a comprehensive shadow system that works for both iOS (shadow*) and Android (elevation).
// The shadows are tinted with the shadow color from various palettes to create depth.

const createShadow = (
    elevation: number,
    shadowColor: string = colors.palette.neutral[900],
    opacity: number = 0.1,
    radius: number = 4,
    offsetY: number = 2
): ViewStyle => {
    return Platform.select({
        ios: {
            shadowColor,
            shadowOffset: { width: 0, height: offsetY },
            shadowOpacity: opacity,
            shadowRadius: radius,
        },
        android: {
            elevation,
            shadowColor, // Android P+ supports colored shadows
        },
        web: {
            boxShadow: `0px ${offsetY}px ${radius}px ${shadowColor}20`, // Simple fallback for web
        },
        default: {},
    });
};

export const shadows = {
    none: createShadow(0, 'transparent', 0, 0, 0),

    // Subtle shadow for cards like 'flat' buttons or input fields
    xs: createShadow(2, colors.palette.neutral[900], 0.05, 2, 1),

    // Standard shadow for cards
    s: createShadow(4, colors.palette.neutral[900], 0.08, 4, 2),

    // Highlighted elements
    m: createShadow(8, colors.palette.neutral[900], 0.12, 8, 4),

    // Modals, Dropdowns
    l: createShadow(16, colors.palette.neutral[900], 0.15, 12, 6),

    // Floating Action Buttons (FABs)
    xl: createShadow(24, colors.palette.neutral[900], 0.2, 16, 8),

    // Colored Shadows (Premium feel for primary actions)
    primary: {
        s: createShadow(4, colors.palette.primary[500], 0.25, 6, 3),
        m: createShadow(8, colors.palette.primary[500], 0.35, 10, 5),
    },
};
