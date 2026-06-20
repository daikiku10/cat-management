import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { CatForm } from "@/components/cats/cat-form";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getCatApi, updateCatApi, type Cat, type CreateCatInput } from "@/lib/api/cats";

export default function EditCatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCat() {
      try {
        const result = await getCatApi(id);
        setCat(result);
      } catch {
        router.back();
      }
      setLoading(false);
    }
    fetchCat();
  }, [id]);

  async function handleSubmit(data: CreateCatInput) {
    await updateCatApi(id, data);
    router.back();
  }

  if (loading || !cat) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `${cat.name}を編集`,
          presentation: "modal",
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.container}>
            <CatForm
              initialData={cat}
              onSubmit={handleSubmit}
              submitLabel="保存"
            />
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
});
