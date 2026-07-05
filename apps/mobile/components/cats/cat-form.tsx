import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemedText } from "@/components/themed-text";
import { Colors, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import type { CreateCatInput, Cat } from "@/lib/api/cats";

type CatFormProps = {
  initialData?: Cat;
  onSubmit: (data: CreateCatInput) => Promise<void>;
  submitLabel: string;
};

type Gender = "male" | "female" | "unknown";

export function CatForm({ initialData, onSubmit, submitLabel }: CatFormProps) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [name, setName] = useState(initialData?.name ?? "");
  const [age, setAge] = useState(initialData?.age?.toString() ?? "");
  const [breed, setBreed] = useState(initialData?.breed ?? "");
  const [photo, setPhoto] = useState(initialData?.photo ?? "");
  const [weight, setWeight] = useState(initialData?.weight?.toString() ?? "");
  const [gender, setGender] = useState<Gender | undefined>(
    (initialData?.gender as Gender) ?? undefined
  );
  const [memo, setMemo] = useState(initialData?.memo ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim()) {
      setError("名前は必須です");
      return;
    }

    setError("");
    setLoading(true);

    const data: CreateCatInput = {
      name: name.trim(),
    };

    if (age) {
      const parsed = parseInt(age, 10);
      if (!isNaN(parsed)) data.age = parsed;
    }
    if (breed) data.breed = breed.trim();
    if (photo) data.photo = photo.trim();
    if (weight) {
      const parsed = parseFloat(weight);
      if (!isNaN(parsed)) data.weight = parsed;
    }
    if (gender) data.gender = gender;
    if (memo) data.memo = memo.trim();

    try {
      await onSubmit(data);
    } catch {
      setError("保存に失敗しました");
      setLoading(false);
    }
  }

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "male", label: "♂ オス" },
    { value: "female", label: "♀ メス" },
    { value: "unknown", label: "不明" },
  ];

  return (
    <View style={styles.container}>
      {error !== "" && (
        <ThemedText style={styles.error} lightColor="#DC2626" darkColor="#EF4444">
          {error}
        </ThemedText>
      )}

      <Input
        label="名前 *"
        placeholder="猫の名前"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="年齢"
        placeholder="年齢（歳）"
        value={age}
        onChangeText={setAge}
        keyboardType="number-pad"
      />

      <Input
        label="品種"
        placeholder="品種（例: スコティッシュフォールド）"
        value={breed}
        onChangeText={setBreed}
      />

      <View style={styles.genderSection}>
        <ThemedText style={styles.label}>性別</ThemedText>
        <View style={styles.genderOptions}>
          {genderOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setGender(option.value)}
              style={[
                styles.genderOption,
                {
                  backgroundColor:
                    gender === option.value ? colors.primary : colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.genderText,
                  { color: gender === option.value ? "#11181C" : colors.text },
                ]}
              >
                {option.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <Input
        label="体重"
        placeholder="体重（kg）"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
      />

      <Input
        label="写真URL"
        placeholder="https://..."
        value={photo}
        onChangeText={setPhoto}
        keyboardType="url"
      />

      <Input
        label="メモ"
        placeholder="特徴や性格など"
        value={memo}
        onChangeText={setMemo}
        multiline
        numberOfLines={3}
        style={styles.memoInput}
      />

      <Button title={submitLabel} onPress={handleSubmit} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  error: {
    textAlign: "center",
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
    marginBottom: 8,
  },
  genderSection: {
    marginBottom: 0,
  },
  genderOptions: {
    flexDirection: "row",
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: "center",
  },
  genderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  memoInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});
