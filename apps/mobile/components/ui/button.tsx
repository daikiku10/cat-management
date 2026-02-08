import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
};

export function Button({
  title,
  loading,
  disabled,
  style,
  variant = "primary",
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    if (variant === "primary") return colors.primary;
    if (variant === "secondary") return colors.card;
    return "transparent";
  };

  const getTextColor = () => {
    if (variant === "primary") return "#11181C";
    return colors.text;
  };

  const getBorderStyle = () => {
    if (variant === "outline") {
      return { borderWidth: 2, borderColor: colors.primary };
    }
    return {};
  };

  return (
    <Pressable
      style={(state) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: isDisabled ? 0.5 : 1,
          shadowColor: colors.shadowColor,
          transform: [{ scale: state.pressed ? 0.97 : 1 }],
        },
        getBorderStyle(),
        variant !== "outline" && Shadows.medium,
        typeof style === "function" ? style(state) : style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <ThemedText style={[styles.text, { color: getTextColor() }]}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});
