// Design tokens extracted from meritum_pantallas HTML designs
export const Colors = {
    primary: '#f48c25',
    primaryDark: '#f27f0d',
    orange600: '#ea580c',

    backgroundLight: '#f8f7f5',
    backgroundDark: '#221910',

    cardLight: '#ffffff',
    cardDark: '#2c241b',

    textMain: '#1c140d',
    textSecondary: '#9c7349',
    textMuted: '#9ca3af',

    white: '#ffffff',
    black: '#000000',

    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',

    blue500: '#3b82f6',
    purple500: '#a855f7',
    red400: '#f87171',
    yellow400: '#facc15',
    green400: '#4ade80',

    // Evaluation specific
    successGreen: '#22c55e',
    errorRed: '#ef4444',
    // Aliases for compatibility
    background: '#f8f7f5',
    text: '#1c140d',
    gray900: '#111827',
};

export const Fonts = {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    extrabold: 'System',
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
};

export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    xxxl: 32,
    full: 9999,
};

export const Shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
    },
    soft: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 5,
    },
    primaryGlow: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
};
