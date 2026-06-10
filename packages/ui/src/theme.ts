// ─── Design System Tokens ────────────────────────────────────────────
// Premium HRMS color palette with carefully curated hues

export const colors = {
  // Primary palette
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primaryLight: '#818CF8',
  primaryBg: '#EEF2FF',

  // Secondary palette
  secondary: '#0EA5E9',
  secondaryDark: '#0284C7',
  secondaryLight: '#7DD3FC',

  // Semantic
  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  info: '#6366F1',
  infoBg: '#EEF2FF',

  // Neutrals
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  placeholder: '#CBD5E1',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  // Overlays
  overlay: 'rgba(15, 23, 42, 0.4)',
  shadowColor: '#0F172A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionMedium: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  small: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3 },
  button: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.3 },
};

export const shadows = {
  sm: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
};
