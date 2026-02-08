import { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { Link } from "expo-router";
import { isAxiosError } from "axios";

import { ThemedText } from "@/components/themed-text";
import { GradientBackground } from "@/components/ui/gradient-background";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  function validatePassword(value: string) {
    setPassword(value);
    if (value.length > 0 && value.length < 8) {
      setPasswordError("パスワードは8文字以上で入力してください");
    } else {
      setPasswordError("");
    }
  }

  async function handleRegister() {
    if (password.length < 8) {
      setPasswordError("パスワードは8文字以上で入力してください");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await register(email, password);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      if (isAxiosError(e) && e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError("登録に失敗しました");
      }
    }
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              shadowColor: colors.shadowColor,
            },
            Shadows.large,
          ]}
        >
          <ThemedText type="title" style={styles.title}>
            ユーザー登録
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
            placeholder="8文字以上"
            secureTextEntry
            value={password}
            onChangeText={validatePassword}
            error={passwordError}
          />

          <Button title="登録" onPress={handleRegister} loading={loading} />

          <Link href="/(auth)/login" style={styles.link}>
            <ThemedText type="link">ログイン画面に戻る</ThemedText>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: 24,
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
    marginTop: 8,
  },
});
