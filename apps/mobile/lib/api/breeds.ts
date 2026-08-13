import { apiClient } from "./client";

export type Breed = {
  id: string;
  name: string;
  origin?: string | null;
  temperament?: string | null;
  lifeSpan?: string | null;
};

export async function getBreedsApi(): Promise<Breed[]> {
  const { data } = await apiClient.get<{ breeds: Breed[] }>("/api/breeds");
  return data.breeds;
}
