// FitBot — Centralized Theme Tokens

export const colors = {
    bgPrimary: '#0a0f1a',
    bgSecondary: '#111827',
    bgCard: 'rgba(17, 24, 39, 0.85)',
    bgGlass: 'rgba(255, 255, 255, 0.04)',
    borderGlass: 'rgba(255, 255, 255, 0.08)',
    surface: '#1e293b',
    background: '#0f172a',
    border: 'rgba(255,255,255,0.1)',
    primary: '#10b981',

    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.3)',
    accentLight: '#34d399',
    accentDark: '#059669',

    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',

    userBubbleStart: '#10b981',
    userBubbleEnd: '#0d9488',
    botBubble: 'rgba(30, 41, 59, 0.9)',
    botBubbleBorder: 'rgba(255, 255, 255, 0.06)',

    userAvatarStart: '#6366f1',
    userAvatarEnd: '#8b5cf6',

    danger: '#ef4444',
    dangerBg: 'rgba(239, 68, 68, 0.1)',

    white: '#ffffff',
    black: '#000000',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const borderRadius = {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 24,
    full: 50,
};

export const fontSize = {
    xs: 11,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
};

export const fontWeight = {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
};

export const theme = {
    colors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight
};
