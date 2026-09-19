import type { FeedingLog, FeedingLogInput, MealType } from "@/lib/api/feeding-logs";

export const mealTypes: MealType[] = ["morning", "noon", "night"];

export const mealLabels: Record<MealType, string> = {
  morning: "朝",
  noon: "昼",
  night: "夜",
};

export const mealChipColors: Record<MealType, { bg: string; text: string }> = {
  morning: { bg: "#FFF1DB", text: "#B8792A" },
  noon: { bg: "#E3F5FB", text: "#2C7A99" },
  night: { bg: "#ECE9F7", text: "#5B4B8A" },
};

export function todayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function computeEatenAmount(
  given?: number | null,
  left?: number | null
): number | null {
  if (given == null || left == null) return null;
  return given - left;
}

export function formatAmountSummary(given?: number | null, left?: number | null): string {
  if (given == null) return "記録あり";
  if (left == null || left === 0) return `${given}g完食`;
  const eaten = given - left;
  return `${given}g中 ${eaten}g食べた`;
}

export type CalendarMark = {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
};

export function buildMarkedDates(
  datesWithLogs: Iterable<string>,
  selectedDate: string,
  colors: { primary: string; primaryDark: string; text: string }
): Record<string, CalendarMark> {
  const marks: Record<string, CalendarMark> = {};
  for (const date of datesWithLogs) {
    marks[date] = { marked: true, dotColor: colors.primaryDark };
  }
  marks[selectedDate] = {
    ...(marks[selectedDate] ?? {}),
    selected: true,
    selectedColor: colors.primary,
    selectedTextColor: colors.text,
  };
  return marks;
}

function numberToText(value: number | null | undefined): string {
  return value != null ? String(value) : "";
}

export function buildFeedingFormParams(
  catId: string,
  date: string,
  mealType: MealType,
  log: FeedingLog | undefined
) {
  if (!log) {
    return { catId, date, mealType };
  }
  return {
    catId,
    date,
    mealType,
    logId: log.id,
    amountGiven: numberToText(log.amountGiven),
    amountLeft: numberToText(log.amountLeft),
    memo: log.memo ?? "",
  };
}

export function parseAmountText(text: string): number | undefined {
  if (!text) return undefined;
  const parsed = parseFloat(text);
  return isNaN(parsed) ? undefined : parsed;
}

export function initialFeedingFormValues(params: {
  amountGiven?: string;
  amountLeft?: string;
  memo?: string;
}) {
  return {
    amountGiven: params.amountGiven ?? "",
    amountLeft: params.amountLeft ?? "",
    memo: params.memo ?? "",
  };
}

export function buildFeedingLogInput(
  date: string,
  mealType: MealType,
  amountGivenText: string,
  amountLeftText: string,
  memo: string
): FeedingLogInput {
  return {
    fedDate: date,
    mealType,
    amountGiven: parseAmountText(amountGivenText),
    amountLeft: parseAmountText(amountLeftText),
    memo: memo.trim() || undefined,
  };
}
