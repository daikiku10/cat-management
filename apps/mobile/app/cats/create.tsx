import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform, View } from "react-native";
import { router } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { CatForm } from "@/components/cats/cat-form";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createCatApi, type CreateCatInput } from "@/lib/api/cats";

export default function CreateCatScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  async function handleSubmit(data: CreateCatInput) {
    await createCatApi(data);
    router.back();
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title="猫を登録" />
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
            <CatForm onSubmit={handleSubmit} submitLabel="登録" />
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
});
