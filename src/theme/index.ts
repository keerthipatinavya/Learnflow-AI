import { MD3DarkTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#6C63FF',
  secondary: '#8B5CF6',
  accent: '#22D3EE',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#334155',
  glassBackground: 'rgba(30, 41, 59, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  accentGlow: 'rgba(34, 211, 238, 0.15)',
  primaryGlow: 'rgba(108, 99, 255, 0.2)',
  gradients: {
    primary: ['#6C63FF', '#8B5CF6'],
    accent: ['#8B5CF6', '#22D3EE'],
    success: ['#22C55E', '#10B981'],
    dark: ['#0F172A', '#1E293B'],
    glass: ['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.8)'],
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  }
};

export const TYPOGRAPHY = {
  display: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 44,
    letterSpacing: -0.5,
    fontFamily: 'System',
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.2,
    fontFamily: 'System',
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: 0,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.1,
    fontFamily: 'System',
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0.2,
    fontFamily: 'System',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
    fontFamily: 'System',
  },
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    fontFamily: 'System',
  }
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryGlow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }
};

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    tertiary: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    onBackground: COLORS.text,
    onSurface: COLORS.text,
    error: COLORS.error,
  },
  roundness: SPACING.borderRadius.md,
};
export type AppTheme = typeof theme;
