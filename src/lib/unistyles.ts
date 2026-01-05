import colors from "@/constants/colors";

const lightTheme = {
  colors: {
    primary: colors.light.primary,
    accent: colors.light.accent,
    body: colors.light.body,
    body2: colors.light.body2,
    background: colors.light.background,
    card: colors.light.card.background,
    muted: colors.light.muted,
    primaryContrast: colors.light.primaryContrast,
    primaryHover: colors.light.primaryHover,
    inputBorder: colors.light.inputBorder,
    divider: colors.light.divider,
    gaining: colors.light.good,
    losing: colors.light.bad,
  },
  gap: (v: number) => v * 8,
};

const darkTheme = {
  colors: {
    primary: colors.dark.primary,
    accent: colors.dark.accent,
    body: colors.dark.body,
    body2: colors.dark.body2,
    background: colors.dark.background,
    card: colors.dark.card.background,
    muted: colors.dark.muted,
    primaryContrast: colors.dark.primaryContrast,
    primaryHover: colors.dark.primaryHover,
    inputBorder: colors.dark.inputBorder,
    divider: colors.dark.divider,
    gaining: colors.dark.good,
    losing: colors.dark.bad,
  },
  gap: (v: number) => v * 8,
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
