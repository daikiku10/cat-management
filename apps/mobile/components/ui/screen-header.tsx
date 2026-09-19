import type { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useThemeColors } from "@/hooks/use-theme-colors";

export const screenHeaderButtonStyle = {
  width: 44,
  height: 44,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

type ScreenHeaderProps = {
  title: string;
  right?: ReactNode;
  backIcon?: "chevron-back" | "close";
};

export function ScreenHeader({ title, right, backIcon = "chevron-back" }: ScreenHeaderProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <View style={{ height: insets.top }} />
      <View style={[styles.headerBar, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={screenHeaderButtonStyle}>
          <Ionicons name={backIcon} size={backIcon === "close" ? 24 : 26} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {title}
        </ThemedText>
        {right ?? <View style={screenHeaderButtonStyle} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.15)",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
});
