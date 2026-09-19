import { apiClient } from "./client";

export type MealType = "morning" | "noon" | "night";

export type FeedingLog = {
  id: string;
  catId: string;
  fedDate: string;
  mealType: MealType;
  amountGiven?: number | null;
  amountLeft?: number | null;
  memo?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FeedingLogInput = {
  fedDate: string;
  mealType: MealType;
  amountGiven?: number;
  amountLeft?: number;
  memo?: string;
};

export async function getFeedingLogsApi(catId: string): Promise<FeedingLog[]> {
  const { data } = await apiClient.get<{ feedingLogs: FeedingLog[] }>(
    `/api/cats/${catId}/feeding-logs`
  );
  return data.feedingLogs;
}

export async function createFeedingLogApi(
  catId: string,
  input: FeedingLogInput
): Promise<FeedingLog> {
  const { data } = await apiClient.post<FeedingLog>(
    `/api/cats/${catId}/feeding-logs`,
    input
  );
  return data;
}

export async function updateFeedingLogApi(
  catId: string,
  logId: string,
  input: Partial<FeedingLogInput>
): Promise<FeedingLog> {
  const { data } = await apiClient.patch<FeedingLog>(
    `/api/cats/${catId}/feeding-logs/${logId}`,
    input
  );
  return data;
}

export async function deleteFeedingLogApi(
  catId: string,
  logId: string
): Promise<void> {
  await apiClient.delete(`/api/cats/${catId}/feeding-logs/${logId}`);
}
