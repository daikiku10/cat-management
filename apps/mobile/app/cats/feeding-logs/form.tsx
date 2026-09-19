import { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Shadows, BorderRadius } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useFeedingLogSubmit } from "@/hooks/use-feeding-log-submit";
import type { MealType } from "@/lib/api/feeding-logs";
import {
  mealTypes,
  mealLabels,
  formatDateLabel,
  computeEatenAmount,
  parseAmountText,
  initialFeedingFormValues,
} from "@/lib/feeding";

function DateInfo({ date }: { date: string }) {
  const colors = useThemeColors();

  return (
    <View style={styles.dateSection}>
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
        <ThemedText style={styles.dateText}>{formatDateLabel(date)}</ThemedText>
      </View>
      <ThemedText style={[styles.dateHint, { color: colors.placeholder }]}>
        日付を変えるにはカレンダーで別の日を選んでください
      </ThemedText>
    </View>
  );
}

function MealTypeSelector({
  value,
  onChange,
}: {
  value: MealType;
  onChange: (mealType: MealType) => void;
}) {
  const colors = useThemeColors();

  return (
    <View style={styles.field}>
      <ThemedText style={styles.fieldLabel}>時間帯</ThemedText>
      <View style={styles.mealOptions}>
        {mealTypes.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.mealOption,
              {
                backgroundColor: value === option ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <ThemedText style={styles.mealOptionText}>{mealLabels[option]}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function AmountField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  const colors = useThemeColors();

  return (
    <View style={styles.amountField}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <View
        style={[
          styles.amountBox,
          { backgroundColor: colors.inputBackground, borderColor: colors.border },
          Shadows.small,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.placeholder}
          style={[styles.amountInput, { color: colors.text }]}
        />
        <ThemedText style={{ color: colors.textSecondary }}>g</ThemedText>
      </View>
    </View>
  );
}

function EatenBadge({ eaten }: { eaten: number | null }) {
  if (eaten === null) return null;

  return (
    <View style={styles.eatenBadge}>
      <ThemedText style={styles.eatenText}>食べた量：{eaten}g（自動計算）</ThemedText>
    </View>
  );
}

function DeleteLink({ onPress }: { onPress: () => void }) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity onPress={onPress} style={styles.deleteButton}>
      <ThemedText style={[styles.deleteText, { color: colors.error }]}>
        この記録を削除
      </ThemedText>
    </TouchableOpacity>
  );
}

export default function FeedingLogFormScreen() {
  const params = useLocalSearchParams<{
    catId: string;
    date: string;
    mealType: MealType;
    logId?: string;
    amountGiven?: string;
    amountLeft?: string;
    memo?: string;
  }>();
  const { catId, date, logId } = params;

  const colors = useThemeColors();
  const initial = initialFeedingFormValues(params);

  const [mealType, setMealType] = useState<MealType>(params.mealType);
  const [amountGiven, setAmountGiven] = useState(initial.amountGiven);
  const [amountLeft, setAmountLeft] = useState(initial.amountLeft);
  const [memo, setMemo] = useState(initial.memo);

  const { isEditing, saving, save, confirmDelete } = useFeedingLogSubmit({ catId, date, logId });
  const eaten = computeEatenAmount(parseAmountText(amountGiven), parseAmountText(amountLeft));
  const title = isEditing ? "食事記録を編集" : "食事記録を追加";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={title} backIcon="close" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <DateInfo date={date} />
          <MealTypeSelector value={mealType} onChange={setMealType} />

          <View style={styles.amountRow}>
            <AmountField label="あげた量" value={amountGiven} onChangeText={setAmountGiven} />
            <AmountField label="残した量" value={amountLeft} onChangeText={setAmountLeft} />
          </View>

          <EatenBadge eaten={eaten} />

          <Input
            label="メモ"
            placeholder="気になったことがあれば"
            value={memo}
            onChangeText={setMemo}
            multiline
            numberOfLines={3}
            style={styles.memoInput}
          />

          <Button
            title="保存する"
            onPress={() => save(mealType, amountGiven, amountLeft, memo)}
            loading={saving}
          />

          {isEditing && <DeleteLink onPress={confirmDelete} />}
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
    padding: 20,
    gap: 16,
  },
  dateSection: {
    gap: 6,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "600",
  },
  dateHint: {
    fontSize: 12,
    marginLeft: 26,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  mealOptions: {
    flexDirection: "row",
    gap: 8,
  },
  mealOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: "center",
  },
  mealOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  amountRow: {
    flexDirection: "row",
    gap: 12,
  },
  amountField: {
    flex: 1,
    gap: 8,
  },
  amountBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  amountInput: {
    flexGrow: 1,
    flexShrink: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  eatenBadge: {
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFF7E8",
  },
  eatenText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B8792A",
  },
  memoInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  deleteButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
