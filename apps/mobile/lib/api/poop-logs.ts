import { apiClient } from "./client";

export type PoopCondition = "good" | "soft" | "hard" | "diarrhea";

export type PoopLog = {
  id: string;
  catId: string;
  condition?: PoopCondition | null;
  memo?: string | null;
  createdAt: string;
};

export type CreatePoopLogInput = {
  condition?: PoopCondition;
  memo?: string;
};

export async function getPoopLogsApi(
  catId: string,
  limit = 20,
  offset = 0
): Promise<{ poopLogs: PoopLog[]; total: number }> {
  const { data } = await apiClient.get<{ poopLogs: PoopLog[]; total: number }>(
    `/api/cats/${catId}/poop-logs?limit=${limit}&offset=${offset}`
  );
  return data;
}

export async function createPoopLogApi(
  catId: string,
  input: CreatePoopLogInput
): Promise<PoopLog> {
  const { data } = await apiClient.post<PoopLog>(
    `/api/cats/${catId}/poop-logs`,
    input
  );
  return data;
}

export async function deletePoopLogApi(
  catId: string,
  logId: string
): Promise<void> {
  await apiClient.delete(`/api/cats/${catId}/poop-logs/${logId}`);
}
