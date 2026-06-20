import { apiClient } from "./client";

export type Cat = {
  id: string;
  ownerId: string;
  name: string;
  age?: number | null;
  breed?: string | null;
  photo?: string | null;
  weight?: number | null;
  gender?: "male" | "female" | "unknown" | null;
  memo?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateCatInput = {
  name: string;
  age?: number;
  breed?: string;
  photo?: string;
  weight?: number;
  gender?: "male" | "female" | "unknown";
  memo?: string;
};

export type UpdateCatInput = Partial<CreateCatInput>;

export async function getCatsApi(
  limit = 20,
  offset = 0
): Promise<{ cats: Cat[]; total: number }> {
  const { data } = await apiClient.get<{ cats: Cat[]; total: number }>(
    `/api/cats?limit=${limit}&offset=${offset}`
  );
  return data;
}

export async function getCatApi(id: string): Promise<Cat> {
  const { data } = await apiClient.get<Cat>(`/api/cats/${id}`);
  return data;
}

export async function createCatApi(input: CreateCatInput): Promise<Cat> {
  const { data } = await apiClient.post<Cat>("/api/cats", input);
  return data;
}

export async function updateCatApi(
  id: string,
  input: UpdateCatInput
): Promise<Cat> {
  const { data } = await apiClient.patch<Cat>(`/api/cats/${id}`, input);
  return data;
}

export async function deleteCatApi(id: string): Promise<void> {
  await apiClient.delete(`/api/cats/${id}`);
}
