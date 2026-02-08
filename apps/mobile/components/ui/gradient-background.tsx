import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, type ViewStyle } from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type GradientBackgroundProps = {
  style?: ViewStyle;
  children?: React.ReactNode;
  variant?: "sky" | "accent";
};

export function GradientBackground({
  style,
  children,
  variant = "sky",
}: GradientBackgroundProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const gradientColors =
    variant === "sky"
      ? ([colors.skyBlue, colors.skyBlueDark] as const)
      : ([colors.gradientStart, colors.gradientEnd] as const);

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.gradient, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
