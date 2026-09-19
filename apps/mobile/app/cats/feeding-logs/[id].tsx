import { useState } from "react";
import { Alert, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Input } from "@/components/ui/input";
import { LogScreen } from "@/components/cats/log-screen";
import { useLogEntries } from "@/hooks/use-log-entries";
import {
  getFeedingLogsApi,
  createFeedingLogApi,
  deleteFeedingLogApi,
  type CreateFeedingLogInput,
} from "@/lib/api/feeding-logs";

async function fetchFeedingLogs(catId: string) {
  const result = await getFeedingLogsApi(catId);
  return result.feedingLogs;
}

function parseAmount(amount: string): number | undefined {
  if (!amount) return undefined;
  const parsed = parseFloat(amount);
  return isNaN(parsed) ? undefined : parsed;
}

function buildFeedingLogInput(
  amount: string,
  foodType: string,
  memo: string
): CreateFeedingLogInput {
  return {
    amount: parseAmount(amount),
    foodType: foodType.trim() || undefined,
    memo: memo.trim() || undefined,
  };
}

export default function FeedingLogsScreen() {
  const { id: catId } = useLocalSearchParams<{ id: string }>();
  const { logs, loading, refresh, remove } = useLogEntries({
    catId,
    fetchLogs: fetchFeedingLogs,
    deleteLog: deleteFeedingLogApi,
  });

  const [amount, setAmount] = useState("");
  const [foodType, setFoodType] = useState("");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await createFeedingLogApi(catId, buildFeedingLogInput(amount, foodType, memo));
      setAmount("");
      setFoodType("");
      setMemo("");
      await refresh();
    } catch {
      Alert.alert("エラー", "記録に失敗しました");
    }
    setSubmitting(false);
  }

  return (
    <LogScreen
      title="食事記録"
      loading={loading}
      submitting={submitting}
      logs={logs}
      onSubmit={handleSubmit}
      onDelete={remove}
      renderDetail={(log) =>
        [log.amount ? `${log.amount}g` : null, log.foodType].filter(Boolean).join(" ・ ") ||
        "記録"
      }
      formContent={
        <>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Input
                label="量 (g)"
                placeholder="量"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="フード"
                placeholder="フード名"
                value={foodType}
                onChangeText={setFoodType}
              />
            </View>
          </View>
          <Input label="メモ" placeholder="メモ（任意）" value={memo} onChangeText={setMemo} />
        </>
      }
    />
  );
}
