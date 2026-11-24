import axios from "axios";
import { Platform } from "react-native";
import { getToken } from "@/lib/auth";

const getBaseURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Web はブラウザと同じホストの API を叩く（LAN IP が変わっても PC からは届く）
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `http://${window.location.hostname}:8080`;
  }
  const host = process.env.EXPO_PUBLIC_API_HOST ?? "localhost";
  return `http://${host}:8080`;
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  // 到達できない宛先で無限にローディングし続けないようにする
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
