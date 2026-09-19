import { StyleSheet, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useThemeColors } from "@/hooks/use-theme-colors";

type TabButtonProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  active: boolean;
  activeColor: string;
  inactiveColor: string;
  onPress: () => void;
};

function TabButton({ icon, label, active, activeColor, inactiveColor, onPress }: TabButtonProps) {
  const color = active ? activeColor : inactiveColor;
  return (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Ionicons name={icon} size={22} color={color} />
      <ThemedText style={[styles.label, { color }, active && styles.labelActive]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

type CatBottomTabsProps = {
  catId: string;
  active: "detail" | "feeding";
};

export function CatBottomTabs({ catId, active }: CatBottomTabsProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 8 },
      ]}
    >
      <TabButton
        icon="paw"
        label="詳細"
        active={active === "detail"}
        activeColor={colors.primaryDark}
        inactiveColor={colors.icon}
        onPress={() => router.replace(`/cats/${catId}`)}
      />
      <TabButton
        icon="restaurant"
        label="食事記録"
        active={active === "feeding"}
        activeColor={colors.primaryDark}
        inactiveColor={colors.icon}
        onPress={() => router.replace(`/cats/feeding-logs/${catId}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },
  labelActive: {
    fontWeight: "700",
  },
});
