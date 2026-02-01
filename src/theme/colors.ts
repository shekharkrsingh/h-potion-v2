const palette = {
    primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
    },
    secondary: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
    },
    neutral: {
        0: '#ffffff',
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },
    error: {
        50: '#fef2f2',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        900: '#7f1d1d',
    },
    warning: {
        50: '#fffbeb',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        900: '#78350f',
    },
    info: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        900: '#1e3a8a',
    },
};

export const lightColors = {
    mode: 'light',
    palette,

    background: {
        default: palette.neutral[0],
        subtle: palette.neutral[50],
        canvas: palette.neutral[100],
        inverted: palette.neutral[900],
        primary: palette.primary[500],
        secondary: palette.secondary[100],
        card: palette.neutral[0],
        modal: palette.neutral[0],
    },

    text: {
        primary: palette.neutral[900],
        secondary: palette.neutral[500],
        tertiary: palette.neutral[400],
        inverted: palette.neutral[0],
        brand: palette.primary[600],
        error: palette.error[700],
        success: palette.secondary[700],
    },

    border: {
        subtle: palette.neutral[100],
        default: palette.neutral[200],
        strong: palette.neutral[300],
        active: palette.primary[500],
        error: palette.error[500],
    },

    icon: {
        default: palette.neutral[500],
        active: palette.primary[500],
        activeDark: palette.primary[700],
        inverse: palette.neutral[0],
    },

    status: {
        success: palette.secondary[500],
        successBg: palette.secondary[50],
        error: palette.error[500],
        errorBg: palette.error[50],
        warning: palette.warning[500],
        warningBg: palette.warning[50],
        info: palette.info[500],
        infoBg: palette.info[50],
    },

    overlay: 'rgba(15, 23, 42, 0.6)',
};

export type ColorTheme = typeof lightColors;

export const darkColors: ColorTheme = {
    mode: 'dark',
    palette,

    background: {
        default: '#0f172a', // Deep Navy (neutral.900 equivalent)
        subtle: '#1e293b',  // Slate 800
        canvas: '#020617',  // Richer Darker Slate 950
        inverted: palette.neutral[0],
        primary: palette.primary[600],
        secondary: palette.secondary[900],
        card: '#1e293b', // Solid Slate 800 (Was translucent)
        modal: '#1e293b',
    },

    text: {
        primary: '#f8fafc',  // Slate 50
        secondary: '#e2e8f0', // Slate 200 (Was 400, too dim)
        tertiary: '#cbd5e1',  // Slate 300 (Was 500, too dim)
        inverted: '#0f172a',
        brand: palette.primary[400],
        error: palette.error[500],
        success: palette.secondary[400],
    },

    border: {
        subtle: 'rgba(255, 255, 255, 0.05)',
        default: 'rgba(255, 255, 255, 0.1)',
        strong: 'rgba(255, 255, 255, 0.2)',
        active: palette.primary[400],
        error: palette.error[500],
    },

    icon: {
        default: '#94a3b8',
        active: palette.primary[400],
        activeDark: palette.primary[300],
        inverse: '#0f172a',
    },

    status: {
        success: palette.secondary[400],
        successBg: 'rgba(16, 185, 129, 0.15)',
        error: palette.error[500],
        errorBg: 'rgba(239, 68, 68, 0.15)',
        warning: palette.warning[500],
        warningBg: 'rgba(245, 158, 11, 0.15)',
        info: palette.info[500],
        infoBg: 'rgba(59, 130, 246, 0.15)',
    },

    overlay: 'rgba(2, 6, 23, 0.85)',
};

export const colors = lightColors;
