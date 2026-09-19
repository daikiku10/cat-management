import { useCallback, useMemo, useState } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { Calendar, LocaleConfig, type DateData } from "react-native-calendars";

import { ThemedText } from "@/components/themed-text";
import { CatBottomTabs } from "@/components/cats/cat-bottom-tabs";
import { ScreenHeader } from "@/components/ui/screen-header";
import { Shadows, BorderRadius, Fonts } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { getCatApi } from "@/lib/api/cats";
import { getFeedingLogsApi, type FeedingLog, type MealType } from "@/lib/api/feeding-logs";
import {
  mealTypes,
  mealLabels,
  mealChipColors,
  todayDateString,
  formatDateLabel,
  formatAmountSummary,
  buildMarkedDates,
  buildFeedingFormParams,
} from "@/lib/feeding";

LocaleConfig.locales.ja = {
  monthNames: [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ],
  monthNamesShort: [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ],
  dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
  dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
  today: "今日",
};
LocaleConfig.defaultLocale = "ja";

function FilledMealSlot({ log }: { log: FeedingLog }) {
  const colors = useThemeColors();

  return (
    <View style={styles.slotInfo}>
      <ThemedText style={styles.slotMain}>
        {formatAmountSummary(log.amountGiven, log.amountLeft)}
      </ThemedText>
      {log.amountLeft ? (
        <ThemedText style={[styles.slotLeft, { color: colors.error }]}>
          残し {log.amountLeft}g
        </ThemedText>
      ) : null}
      {log.memo ? <ThemedText style={styles.slotMemo}>{log.memo}</ThemedText> : null}
    </View>
  );
}

function EmptyMealSlot() {
  const colors = useThemeColors();

  return (
    <View style={styles.slotInfo}>
      <ThemedText style={[styles.slotEmptyText, { color: colors.placeholder }]}>
        まだ記録がありません
      </ThemedText>
    </View>
  );
}

function MealSlotCard({
  mealType,
  log,
  onPress,
}: {
  mealType: MealType;
  log: FeedingLog | undefined;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  const chip = mealChipColors[mealType];
  const cardStyle = log
    ? [styles.slotCard, { backgroundColor: colors.card }, Shadows.small]
    : [styles.slotCard, styles.slotCardEmpty, { backgroundColor: colors.background, borderColor: colors.border }];

  return (
    <TouchableOpacity onPress={onPress} style={cardStyle}>
      <View style={[styles.chip, { backgroundColor: chip.bg }]}>
        <ThemedText style={[styles.chipText, { color: chip.text }]}>
          {mealLabels[mealType]}
        </ThemedText>
      </View>
      {log ? <FilledMealSlot log={log} /> : <EmptyMealSlot />}
    </TouchableOpacity>
  );
}

export default function FeedingLogsScreen() {
  const { id: catId } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();

  const [catName, setCatName] = useState("");
  const [logs, setLogs] = useState<FeedingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(todayDateString());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cat, feedingLogs] = await Promise.all([
        getCatApi(catId),
        getFeedingLogsApi(catId),
      ]);
      setCatName(cat.name);
      setLogs(feedingLogs);
    } catch {
      Alert.alert("エラー", "食事記録を取得できませんでした");
    }
    setLoading(false);
  }, [catId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const logsByDate = useMemo(() => {
    const map = new Map<string, FeedingLog[]>();
    for (const log of logs) {
      const list = map.get(log.fedDate) ?? [];
      list.push(log);
      map.set(log.fedDate, list);
    }
    return map;
  }, [logs]);

  const markedDates = useMemo(
    () => buildMarkedDates(logsByDate.keys(), selectedDate, colors),
    [logsByDate, selectedDate, colors]
  );

  const logsByMealType = useMemo(() => {
    const selectedLogs = logsByDate.get(selectedDate) ?? [];
    const map: Partial<Record<MealType, FeedingLog>> = {};
    for (const log of selectedLogs) {
      map[log.mealType] = log;
    }
    return map;
  }, [logsByDate, selectedDate]);

  function handleDayPress(day: DateData) {
    setSelectedDate(day.dateString);
  }

  function handleSlotPress(mealType: MealType) {
    router.push({
      pathname: "/cats/feeding-logs/form",
      params: buildFeedingFormParams(catId, selectedDate, mealType, logsByMealType[mealType]),
    });
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={catName ? `${catName}の食事記録` : "食事記録"} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={{ backgroundColor: colors.background }}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.calendarCard, { backgroundColor: colors.card }, Shadows.medium]}>
            <Calendar
              current={selectedDate}
              markedDates={markedDates}
              onDayPress={handleDayPress}
              enableSwipeMonths
              theme={{
                backgroundColor: colors.card,
                calendarBackground: colors.card,
                textSectionTitleColor: colors.textSecondary,
                todayTextColor: colors.primaryDark,
                dayTextColor: colors.text,
                textDisabledColor: colors.placeholder,
                monthTextColor: colors.text,
                arrowColor: colors.textSecondary,
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.text,
                dotColor: colors.primaryDark,
                textDayFontFamily: Fonts.regular,
                textMonthFontFamily: Fonts.medium,
                textDayHeaderFontFamily: Fonts.medium,
              }}
            />
          </View>

          <View style={styles.slotSection}>
            <ThemedText style={styles.slotSectionTitle}>
              {formatDateLabel(selectedDate)}の記録
            </ThemedText>
            {mealTypes.map((mealType) => (
              <MealSlotCard
                key={mealType}
                mealType={mealType}
                log={logsByMealType[mealType]}
                onPress={() => handleSlotPress(mealType)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      <CatBottomTabs catId={catId} active="feeding" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 20,
  },
  calendarCard: {
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
  },
  slotSection: {
    gap: 12,
  },
  slotSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  slotCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: BorderRadius.large,
    padding: 14,
  },
  slotCardEmpty: {
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  chip: {
    flexShrink: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
  },
  slotInfo: {
    flexGrow: 1,
    gap: 4,
  },
  slotMain: {
    fontSize: 15,
    fontWeight: "600",
  },
  slotLeft: {
    fontSize: 13,
  },
  slotMemo: {
    fontSize: 13,
    opacity: 0.7,
  },
  slotEmptyText: {
    fontSize: 14,
  },
});
