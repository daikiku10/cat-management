import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

// expo-secure-store は Web 非対応のため、Web では localStorage に保存する
const isWeb = Platform.OS === "web";

export async function saveToken(token: string): Promise<void> {
  if (isWeb) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  if (isWeb) {
    // 静的レンダリング（SSG）時は localStorage が存在しない
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout(): Promise<void> {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
