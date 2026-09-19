import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

import {
  createFeedingLogApi,
  updateFeedingLogApi,
  deleteFeedingLogApi,
  type MealType,
} from "@/lib/api/feeding-logs";
import { buildFeedingLogInput } from "@/lib/feeding";

type UseFeedingLogSubmitOptions = {
  catId: string;
  date: string;
  logId?: string;
};

export function useFeedingLogSubmit({ catId, date, logId }: UseFeedingLogSubmitOptions) {
  const [saving, setSaving] = useState(false);
  const isEditing = !!logId;

  async function save(mealType: MealType, amountGiven: string, amountLeft: string, memo: string) {
    setSaving(true);
    try {
      const input = buildFeedingLogInput(date, mealType, amountGiven, amountLeft, memo);
      if (logId) {
        await updateFeedingLogApi(catId, logId, input);
      } else {
        await createFeedingLogApi(catId, input);
      }
      router.back();
    } catch {
      Alert.alert("エラー", "保存に失敗しました");
      setSaving(false);
    }
  }

  async function performDelete(targetLogId: string) {
    try {
      await deleteFeedingLogApi(catId, targetLogId);
      router.back();
    } catch {
      Alert.alert("エラー", "削除に失敗しました");
    }
  }

  function confirmDelete() {
    if (!logId) return;
    const targetLogId = logId;
    Alert.alert("削除確認", "この記録を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      { text: "削除", style: "destructive", onPress: () => performDelete(targetLogId) },
    ]);
  }

  return { isEditing, saving, save, confirmDelete };
}
