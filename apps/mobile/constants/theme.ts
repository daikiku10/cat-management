/**
 * nani.now inspired theme - Yellow primary with sky blue gradients
 */

// Primary colors
const primaryYellow = "#f5d397";
const primaryYellowDark = "#e6b84a";

export const Colors = {
  light: {
    // Primary
    primary: primaryYellow,
    primaryDark: primaryYellowDark,

    // Text
    text: "#11181C",
    textSecondary: "#687076",

    // Backgrounds
    background: "#f8fbff",
    card: "#ffffff",

    // Gradient colors
    gradientStart: "#f5deb3",
    gradientEnd: "#f5d162",
    skyBlue: "#87CEEB",
    skyBlueDark: "#7EC8E3",

    // UI
    tint: primaryYellow,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primaryYellow,
    border: "#E5E8EB",
    error: "#DC2626",
    inputBackground: "#ffffff",
    placeholder: "#9BA1A6",

    // Shadow
    shadowColor: "#000000",
  },
  dark: {
    // Primary
    primary: primaryYellow,
    primaryDark: primaryYellowDark,

    // Text
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",

    // Backgrounds
    background: "#0d1117",
    card: "#1E2022",

    // Gradient colors
    gradientStart: "#4a90a4",
    gradientEnd: "#8b6b9c",
    skyBlue: "#1a3a4a",
    skyBlueDark: "#152d3a",

    // UI
    tint: primaryYellow,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryYellow,
    border: "#3A3F44",
    error: "#EF4444",
    inputBackground: "#1E2022",
    placeholder: "#687076",

    // Shadow
    shadowColor: "#000000",
  },
};

export const Shadows = {
  small: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 24,
  full: 9999,
};

export const Fonts = {
  regular: "NotoSansJP_400Regular",
  medium: "NotoSansJP_500Medium",
  bold: "NotoSansJP_700Bold",
};
