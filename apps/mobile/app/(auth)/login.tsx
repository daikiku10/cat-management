import { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Link } from "expo-router";
import { isAxiosError } from "axios";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      if (isAxiosError(e) && e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError("ログインに失敗しました");
      }
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedText type="title" style={styles.title}>
          ログイン
        </ThemedText>

        {error !== "" && (
          <ThemedText
            style={styles.error}
            lightColor="#DC2626"
            darkColor="#EF4444"
          >
            {error}
          </ThemedText>
        )}

        <Input
          label="メールアドレス"
          placeholder="example@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="パスワード"
          placeholder="パスワード"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="ログイン" onPress={handleLogin} loading={loading} />

        <Link href="/(auth)/register" style={styles.link}>
          <ThemedText type="link">アカウントを作成する</ThemedText>
        </Link>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  inner: {
    paddingHorizontal: 24,
    gap: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  error: {
    textAlign: "center",
    fontSize: 14,
  },
  link: {
    alignSelf: "center",
  },
});
