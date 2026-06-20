import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { Cat } from "@/lib/api/cats";

type CatCardProps = {
  cat: Cat;
  onPress: () => void;
};

export function CatCard({ cat, onPress }: CatCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const genderLabel = cat.gender === "male" ? "♂" : cat.gender === "female" ? "♀" : "";

  return (
    <Pressable
      onPress={onPress}
      style={(state) => [
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: colors.shadowColor,
          transform: [{ scale: state.pressed ? 0.98 : 1 }],
        },
        Shadows.medium,
      ]}
    >
      {cat.photo ? (
        <Image source={{ uri: cat.photo }} style={styles.image} />
      ) : (
        <View
          style={[styles.imagePlaceholder, { backgroundColor: colors.border }]}
        >
          <Ionicons name="paw" size={32} color={colors.icon} />
        </View>
      )}
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" style={styles.name}>
          {cat.name} {genderLabel}
        </ThemedText>
        {cat.breed && (
          <ThemedText style={styles.breed}>{cat.breed}</ThemedText>
        )}
        <View style={styles.details}>
          {cat.age !== null && cat.age !== undefined && (
            <ThemedText style={styles.detail}>{cat.age}歳</ThemedText>
          )}
          {cat.weight !== null && cat.weight !== undefined && (
            <ThemedText style={styles.detail}>{cat.weight}kg</ThemedText>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: BorderRadius.large,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.medium,
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 32,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
  },
  breed: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  details: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  detail: {
    fontSize: 13,
    opacity: 0.6,
  },
});
