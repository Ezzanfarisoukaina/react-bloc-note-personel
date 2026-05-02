// constants/theme.js

export const COLORS_LIGHT = {
  background: '#F7F5F2',
  surface: '#FFFFFF',
  surfaceAlt: '#EEEAE4',
  primary: '#2D6A4F',
  primaryLight: '#52B788',
  accent: '#D4A373',
  accentLight: '#FEFAE0',
  danger: '#C1121F',
  dangerLight: '#FFE5E5',
  star: '#F4A261',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#A0A0A0',
  border: '#E0DAD0',
  shadow: 'rgba(0,0,0,0.08)',
  cardShadow: 'rgba(0,0,0,0.06)',
  overlay: 'rgba(0,0,0,0.4)',
  tagBg: '#E8F4EF',
  tagText: '#2D6A4F',
};

export const COLORS_DARK = {
  background: '#0F0F13',
  surface: '#1C1C24',
  surfaceAlt: '#252530',
  primary: '#52B788',
  primaryLight: '#74C69D',
  accent: '#D4A373',
  accentLight: '#2D2416',
  danger: '#E63946',
  dangerLight: '#2D0A0C',
  star: '#F4A261',
  text: '#F0EDE8',
  textSecondary: '#A8A4A0',
  textMuted: '#5C5C6E',
  border: '#2C2C3A',
  shadow: 'rgba(0,0,0,0.4)',
  cardShadow: 'rgba(0,0,0,0.3)',
  overlay: 'rgba(0,0,0,0.6)',
  tagBg: '#1A2E24',
  tagText: '#74C69D',
};

export const TYPOGRAPHY = {
  fontSizeXS: 11,
  fontSizeSM: 13,
  fontSizeMD: 15,
  fontSizeLG: 18,
  fontSizeXL: 22,
  fontSizeXXL: 28,
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  lineHeightSM: 18,
  lineHeightMD: 22,
  lineHeightLG: 28,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const SHADOWS = {
  small: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
};

// Catégories de couleurs pour les notes
export const NOTE_COLORS = [
  { id: 'default', light: '#FFFFFF', dark: '#1C1C24', label: 'Défaut' },
  { id: 'mint', light: '#E8F4EF', dark: '#1A2E24', label: 'Menthe' },
  { id: 'peach', light: '#FFF0E6', dark: '#2D1A0E', label: 'Pêche' },
  { id: 'lavender', light: '#EDE9F5', dark: '#1E1A2E', label: 'Lavande' },
  { id: 'sky', light: '#E6F2FF', dark: '#0E1A2D', label: 'Ciel' },
  { id: 'rose', light: '#FFE8EC', dark: '#2D0E14', label: 'Rose' },
];
