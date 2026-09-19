import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Input } from "@/components/ui/input";
import { ThemedText } from "@/components/themed-text";
import { LogScreen } from "@/components/cats/log-screen";
import { useLogEntries } from "@/hooks/use-log-entries";
import { Colors, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  getPoopLogsApi,
  createPoopLogApi,
  deletePoopLogApi,
  type PoopCondition,
} from "@/lib/api/poop-logs";

const conditionOptions: { value: PoopCondition; label: string }[] = [
  { value: "good", label: "良好" },
  { value: "soft", label: "軟便" },
  { value: "hard", label: "硬め" },
  { value: "diarrhea", label: "下痢" },
];

const conditionLabels: Record<PoopCondition, string> = {
  good: "良好",
  soft: "軟便",
  hard: "硬め",
  diarrhea: "下痢",
};

async function fetchPoopLogs(catId: string) {
  const result = await getPoopLogsApi(catId);
  return result.poopLogs;
}

export default function PoopLogsScreen() {
  const { id: catId } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const { logs, loading, refresh, remove } = useLogEntries({
    catId,
    fetchLogs: fetchPoopLogs,
    deleteLog: deletePoopLogApi,
  });

  const [condition, setCondition] = useState<PoopCondition | undefined>();
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await createPoopLogApi(catId, {
        condition,
        memo: memo ? memo.trim() : undefined,
      });
      setCondition(undefined);
      setMemo("");
      await refresh();
    } catch {
      Alert.alert("エラー", "記録に失敗しました");
    }
    setSubmitting(false);
  }

  return (
    <LogScreen
      title="うんち記録"
      loading={loading}
      submitting={submitting}
      logs={logs}
      onSubmit={handleSubmit}
      onDelete={remove}
      renderDetail={(log) => (log.condition ? conditionLabels[log.condition] : "記録")}
      formContent={
        <>
          <View>
            <ThemedText style={styles.label}>状態</ThemedText>
            <View style={styles.conditionOptions}>
              {conditionOptions.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setCondition(option.value)}
                  style={[
                    styles.conditionOption,
                    {
                      backgroundColor:
                        condition === option.value ? colors.primary : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.conditionText,
                      { color: condition === option.value ? "#11181C" : colors.text },
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          <Input label="メモ" placeholder="メモ（任意）" value={memo} onChangeText={setMemo} />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
    marginBottom: 8,
  },
  conditionOptions: {
    flexDirection: "row",
    gap: 8,
  },
  conditionOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: "center",
  },
  conditionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
