import { ViewStyle } from 'react-native';
import { ColorTheme } from '@/theme/colors';

/**
 * Shared glassmorphism style generator for dashboard cards and panels.
 * Provides a consistent translucent look that works with both light and dark themes.
 */
export const getGlassStyle = (theme: ColorTheme): ViewStyle => ({
    backgroundColor: theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
    shadowColor: theme.mode === 'dark' ? '#000' : theme.palette.primary[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.08,
    shadowRadius: 24,
});
