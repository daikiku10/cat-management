import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
};

export function Button({
  title,
  loading,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={(state) => [
        styles.button,
        {
          backgroundColor: colors.tint,
          opacity: isDisabled ? 0.5 : state.pressed ? 0.8 : 1,
        },
        typeof style === "function" ? style(state) : style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ThemedText style={styles.text} lightColor="#fff" darkColor="#11181C">
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
