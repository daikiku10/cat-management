import { Slot, useRouter, useSegments } from "expo-router";
import "react-native-reanimated";
import "./styles/global.css";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // 未認証かつ認証必要なルートにいる場合、ログインへリダイレクト
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // 認証済みなのに認証ページにいる場合、ホームへリダイレクト
      router.replace("/home");
    }
  }, [user, segments, loading]);

  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <Slot />
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
