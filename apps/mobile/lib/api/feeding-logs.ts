import { apiClient } from "./client";

export type FeedingLog = {
  id: string;
  catId: string;
  amount?: number | null;
  foodType?: string | null;
  memo?: string | null;
  createdAt: string;
};

export type CreateFeedingLogInput = {
  amount?: number;
  foodType?: string;
  memo?: string;
};

export async function getFeedingLogsApi(
  catId: string,
  limit = 20,
  offset = 0
): Promise<{ feedingLogs: FeedingLog[]; total: number }> {
  const { data } = await apiClient.get<{ feedingLogs: FeedingLog[]; total: number }>(
    `/api/cats/${catId}/feeding-logs?limit=${limit}&offset=${offset}`
  );
  return data;
}

export async function createFeedingLogApi(
  catId: string,
  input: CreateFeedingLogInput
): Promise<FeedingLog> {
  const { data } = await apiClient.post<FeedingLog>(
    `/api/cats/${catId}/feeding-logs`,
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
