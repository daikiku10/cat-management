import { useEffect, useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { Colors, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getBreedsApi, type Breed } from "@/lib/api/breeds";

type BreedPickerProps = {
  visible: boolean;
  selectedBreedId?: string;
  onSelect: (breed: Breed) => void;
  onClose: () => void;
};

export function BreedPicker({ visible, selectedBreedId, onSelect, onClose }: BreedPickerProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!visible || breeds.length > 0) return;
    setLoading(true);
    getBreedsApi()
      .then(setBreeds)
      .catch(() => setBreeds([]))
      .finally(() => setLoading(false));
  }, [visible, breeds.length]);

  const filtered = useMemo(() => {
    if (!query.trim()) return breeds;
    return breeds.filter((b) => b.name.includes(query.trim()));
  }, [breeds, query]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <ThemedText type="defaultSemiBold" style={styles.title}>
            品種を選択
          </ThemedText>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="品種を検索"
          placeholderTextColor={colors.placeholder}
          style={[
            styles.search,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            !loading ? (
              <ThemedText style={styles.empty}>
                {breeds.length === 0 ? "品種一覧を取得できませんでした" : "該当する品種がありません"}
              </ThemedText>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelect(item)}
              style={[styles.row, { borderBottomColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.rowName}>{item.name}</ThemedText>
                {item.origin && (
                  <ThemedText style={styles.rowOrigin}>{item.origin}</ThemedText>
                )}
              </View>
              {item.id === selectedBreedId && (
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              )}
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
  },
  closeButton: {
    padding: 4,
  },
  search: {
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowName: {
    fontSize: 16,
  },
  rowOrigin: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    opacity: 0.6,
  },
});
