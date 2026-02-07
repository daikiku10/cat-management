import { apiClient } from "./client";

export async function loginApi(
  email: string,
  password: string,
): Promise<{ token: string }> {
  const { data } = await apiClient.post<{ token: string }>("/api/auth/login", {
    email,
    password,
  });
  return data;
}

export async function registerApi(
  email: string,
  password: string,
): Promise<void> {
  console.log("Calling registerApi with", { email, password });
  await apiClient.post("/api/auth/register", { email, password });
}

export async function logoutApi(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}
