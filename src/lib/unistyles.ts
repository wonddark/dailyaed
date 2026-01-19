import colors from "@/constants/colors";

const lightTheme = {
  colors: {
    primary: colors.light.primary,
    primaryContrast: colors.light.primaryContrast,
    primaryHover: colors.light.primaryHover,
    accent: colors.light.accent,
    secondary: colors.light.secondary,
    secondaryContrast: colors.light.secondaryContrast,
    secondaryHover: colors.light.secondaryHover,
    body: colors.light.body,
    body2: colors.light.body2,
    background: colors.light.background,
    card: colors.light.card.background,
    muted: colors.light.muted,
    inputBorder: colors.light.inputBorder,
    divider: colors.light.divider,
    gaining: colors.light.good,
    losing: colors.light.bad,
  },
  gap: (v: number) => v * 8,
  lineHeight: (fontSize: number, multiplier: number) => fontSize * multiplier,
};

const darkTheme = {
  colors: {
    primary: colors.dark.primary,
    primaryContrast: colors.dark.primaryContrast,
    primaryHover: colors.dark.primaryHover,
    accent: colors.dark.accent,
    secondary: colors.dark.secondary,
    secondaryContrast: colors.dark.secondaryContrast,
    secondaryHover: colors.dark.secondaryHover,
    body: colors.dark.body,
    body2: colors.dark.body2,
    background: colors.dark.background,
    card: colors.dark.card.background,
    muted: colors.dark.muted,
    inputBorder: colors.dark.inputBorder,
    divider: colors.dark.divider,
    gaining: colors.dark.good,
    losing: colors.dark.bad,
  },
  gap: (v: number) => v * 8,
  lineHeight: (fontSize: number, multiplier: number) => fontSize * multiplier,
};

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
};

export const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

export const settings = {
  adaptiveThemes: true,
};

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}
