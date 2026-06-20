import { useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { CatCard } from "@/components/cats/cat-card";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getCatsApi, type Cat } from "@/lib/api/cats";

export default function CatsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchCats = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const result = await getCatsApi(20, 0);
      setCats(result.cats);
      setTotal(result.total);
    } catch {
      // Handle error silently
    }

    if (refresh) setRefreshing(false);
    else setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCats();
    }, [fetchCats]),
  );

  const handleRefresh = () => fetchCats(true);

  const handleCatPress = (cat: Cat) => {
    router.push(`/cats/${cat.id}`);
  };

  const handleAddPress = () => {
    router.push("/cats/create");
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CatCard cat={item} onPress={() => handleCatPress(item)} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText style={styles.emptyText}>🐾</ThemedText>
            <ThemedText type="subtitle">まだ猫がいません</ThemedText>
            <ThemedText style={styles.emptyHint}>
              右下のボタンから猫を登録しましょう
            </ThemedText>
          </View>
        }
        ListHeaderComponent={
          total > 0 ? (
            <ThemedText style={styles.header}>{total}匹の猫</ThemedText>
          ) : null
        }
      />

      <Pressable
        onPress={handleAddPress}
        style={(state) => [
          styles.fab,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.shadowColor,
            transform: [{ scale: state.pressed ? 0.95 : 1 }],
          },
          Shadows.large,
        ]}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    fontSize: 14,
    opacity: 0.6,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyHint: {
    marginTop: 8,
    opacity: 0.6,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
