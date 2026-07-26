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
  },
};

export const Shadows = {
  small: {
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  },
  medium: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  large: {
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
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
