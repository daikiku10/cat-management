import { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { ScreenHeader, screenHeaderButtonStyle } from "@/components/ui/screen-header";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getCatApi, deleteCatApi, type Cat } from "@/lib/api/cats";

export default function CatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(() => {
    async function fetchCat() {
      setLoading(true);
      try {
        const result = await getCatApi(id);
        setCat(result);
      } catch {
        Alert.alert("エラー", "猫の情報を取得できませんでした");
        router.back();
      }
      setLoading(false);
    }
    fetchCat();
  });

  const handleEdit = () => {
    router.push(`/cats/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "削除確認",
      `${cat?.name}を削除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "削除",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteCatApi(id);
              router.back();
            } catch {
              Alert.alert("エラー", "削除に失敗しました");
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const showMenu = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["キャンセル", "編集", "削除"],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 2,
        },
        (index) => {
          if (index === 1) handleEdit();
          else if (index === 2) handleDelete();
        }
      );
    } else {
      Alert.alert("メニュー", undefined, [
        { text: "編集", onPress: handleEdit },
        { text: "削除", style: "destructive", onPress: handleDelete },
        { text: "キャンセル", style: "cancel" },
      ]);
    }
  };

  const genderLabel = cat
    ? cat.gender === "male" ? "♂ オス" : cat.gender === "female" ? "♀ メス" : "不明"
    : "";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={cat?.name ?? ""}
        right={
          <TouchableOpacity onPress={showMenu} style={screenHeaderButtonStyle} disabled={loading}>
            {deleting ? (
              <ActivityIndicator color={colors.text} size="small" />
            ) : (
              <Ionicons name="menu" size={24} color={loading ? colors.icon : colors.text} />
            )}
          </TouchableOpacity>
        }
      />

      {loading || !cat ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={{ backgroundColor: colors.background }}>
          <ThemedView style={styles.container}>
            {cat.photo ? (
              <Image source={{ uri: cat.photo }} style={styles.image} />
            ) : (
              <View
                style={[
                  styles.imagePlaceholder,
                  { backgroundColor: colors.border },
                ]}
              >
                <Ionicons name="paw" size={80} color={colors.icon} />
              </View>
            )}

            <View
              style={[
                styles.card,
                { backgroundColor: colors.card },
                Shadows.medium,
              ]}
            >
              <ThemedText type="title" style={styles.name}>
                {cat.name}
              </ThemedText>

              <View style={styles.infoGrid}>
                <InfoItem label="品種" value={cat.breed?.name || "未設定"} />
                <InfoItem label="年齢" value={cat.age ? `${cat.age}歳` : "未設定"} />
                <InfoItem label="性別" value={genderLabel} />
                <InfoItem
                  label="体重"
                  value={cat.weight ? `${cat.weight}kg` : "未設定"}
                />
              </View>

              {cat.memo && (
                <View style={styles.memoSection}>
                  <ThemedText style={styles.memoLabel}>メモ</ThemedText>
                  <ThemedText style={styles.memoText}>{cat.memo}</ThemedText>
                </View>
              )}
            </View>

            <View style={styles.logButtons}>
              <TouchableOpacity
                onPress={() => router.push(`/cats/feeding-logs/${id}`)}
                style={[styles.logButton, { backgroundColor: colors.card }, Shadows.medium]}
              >
                <Ionicons name="restaurant-outline" size={22} color={colors.text} />
                <ThemedText style={styles.logButtonText}>食事記録</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push(`/cats/poop-logs/${id}`)}
                style={[styles.logButton, { backgroundColor: colors.card }, Shadows.medium]}
              >
                <Ionicons name="water-outline" size={22} color={colors.text} />
                <ThemedText style={styles.logButtonText}>うんち記録</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ScrollView>
      )}
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <ThemedText style={styles.infoLabel}>{label}</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: BorderRadius.large,
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginTop: 16,
    padding: 20,
    borderRadius: BorderRadius.xl,
  },
  name: {
    textAlign: "center",
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  memoSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  memoLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 8,
  },
  memoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  logButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  logButton: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 16,
    borderRadius: BorderRadius.xl,
  },
  logButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
