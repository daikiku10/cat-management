import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";

type LogEntry = { id: string };

type UseLogEntriesOptions<T extends LogEntry> = {
  catId: string;
  fetchLogs: (catId: string) => Promise<T[]>;
  deleteLog: (catId: string, logId: string) => Promise<void>;
};

export function useLogEntries<T extends LogEntry>({
  catId,
  fetchLogs,
  deleteLog,
}: UseLogEntriesOptions<T>) {
  const [logs, setLogs] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setLogs(await fetchLogs(catId));
    } catch {
      Alert.alert("エラー", "記録を取得できませんでした");
    }
    setLoading(false);
  }, [catId, fetchLogs]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  function remove(logId: string) {
    Alert.alert("削除確認", "この記録を削除しますか？", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLog(catId, logId);
            setLogs((prev) => prev.filter((log) => log.id !== logId));
          } catch {
            Alert.alert("エラー", "削除に失敗しました");
          }
        },
      },
    ]);
  }

  return { logs, loading, refresh, remove };
}
