import type { ReactNode } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

function formatLogDateTime(dateStr: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

type LogEntry = {
  id: string;
  createdAt: string;
  memo?: string | null;
};

type LogListProps<T extends LogEntry> = {
  loading: boolean;
  logs: T[];
  onDelete: (logId: string) => void;
  renderDetail: (log: T) => string;
};

function LogList<T extends LogEntry>({ loading, logs, onDelete, renderDetail }: LogListProps<T>) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  if (loading) {
    return <ActivityIndicator style={styles.loading} color={colors.primary} />;
  }

  if (logs.length === 0) {
    return <ThemedText style={styles.empty}>まだ記録がありません</ThemedText>;
  }

  return (
    <>
      {logs.map((log) => (
        <View
          key={log.id}
          style={[styles.logRow, { backgroundColor: colors.card }, Shadows.small]}
        >
          <View style={styles.logInfo}>
            <ThemedText style={styles.logTime}>{formatLogDateTime(log.createdAt)}</ThemedText>
            <ThemedText style={styles.logDetail}>{renderDetail(log)}</ThemedText>
            {log.memo ? <ThemedText style={styles.logMemo}>{log.memo}</ThemedText> : null}
          </View>
          <TouchableOpacity onPress={() => onDelete(log.id)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}

type LogScreenProps<T extends LogEntry> = {
  title: string;
  loading: boolean;
  submitting: boolean;
  logs: T[];
  formContent: ReactNode;
  onSubmit: () => void;
  onDelete: (logId: string) => void;
  renderDetail: (log: T) => string;
};

export function LogScreen<T extends LogEntry>({
  title,
  loading,
  submitting,
  logs,
  formContent,
  onSubmit,
  onDelete,
  renderDetail,
}: LogScreenProps<T>) {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={title} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.form, { backgroundColor: colors.card }, Shadows.small]}>
            {formContent}
            <Button title="記録する" onPress={onSubmit} loading={submitting} />
          </View>

          <LogList loading={loading} logs={logs} onDelete={onDelete} renderDetail={renderDetail} />
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
    padding: 16,
    paddingBottom: 32,
  },
  form: {
    borderRadius: BorderRadius.xl,
    padding: 16,
    gap: 16,
  },
  loading: {
    marginTop: 24,
  },
  empty: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: 24,
  },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.large,
    padding: 14,
    marginTop: 12,
  },
  logInfo: {
    flex: 1,
  },
  logTime: {
    fontSize: 13,
    opacity: 0.6,
  },
  logDetail: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  logMemo: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
