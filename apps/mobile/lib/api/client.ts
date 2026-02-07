import axios from "axios";
import { getToken } from "@/lib/auth";

const getBaseURL = () => {
  const host = process.env.EXPO_PUBLIC_API_HOST ?? "localhost";
  return `http://${host}:8080`;
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
