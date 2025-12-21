/**
 * This file contains the design tokens for the app, including colors, fonts, and border radii.
 * These values are based on the Tailwind CSS configuration found in the design HTML files.
 */


const tintColorLight = '#607AFB'; // Primary color
const tintColorDark = '#FFFFFF';

export const Colors = {
  light: {
    text: '#333333',
    background: '#f5f6f8',
    tint: tintColorLight,
    primary: '#607AFB',
    'alert-high': '#D32F2F',
    'alert-medium': '#FFA000',
    'alert-low': '#FBC02D',
    border: '#D1D5DB',
    inputBackground: '#FFFFFF',
    placeholder: '#9CA3AF',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#E0E0E0',
    background: '#0f1323',
    tint: tintColorDark,
    primary: '#607AFB',
    'alert-high': '#D32F2F',
    'alert-medium': '#FFA000',
    'alert-low': '#FBC02D',
    border: '#324d67',
    inputBackground: '#192633',
    placeholder: '#92adc9',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * The app uses the "Space Grotesk" font. This will be loaded using expo-font.
 * Components should use this object to apply the correct font family.
 */
export const Fonts = {
  display: 'SpaceGrotesk',
};

/**
 * Border radius values from the design system.
 * We convert rem values to unit-less numbers for React Native. (1rem = 16)
 */
export const BorderRadius = {
  DEFAULT: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FakeUser = {
  name: "User",
  email: "user@example.com",
  password: "password123!",
}