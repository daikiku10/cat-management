import { useState, useCallback } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Colors, Shadows, BorderRadius } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getCatApi, deleteCatApi, type Cat } from "@/lib/api/cats";

export default function CatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [cat, setCat] = useState<Cat | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
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
    }, [id])
  );

  const handleEdit = useCallback(() => {
    router.push(`/cats/edit/${id}`);
  }, [id]);

  const handleDelete = useCallback(() => {
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
  }, [cat?.name, id]);

  const showMenu = useCallback(() => {
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
  }, [handleEdit, handleDelete]);

  const genderLabel = cat
    ? cat.gender === "male" ? "♂ オス" : cat.gender === "female" ? "♀ メス" : "不明"
    : "";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* カスタムヘッダー */}
      <View style={{ backgroundColor: colors.background }}>
        <View style={{ height: insets.top }} />
        <View style={[styles.headerBar, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {cat?.name ?? ""}
          </ThemedText>
          <TouchableOpacity onPress={showMenu} style={styles.headerButton} disabled={loading}>
            {deleting ? (
              <ActivityIndicator color={colors.text} size="small" />
            ) : (
              <Ionicons name="menu" size={24} color={loading ? colors.icon : colors.text} />
            )}
          </TouchableOpacity>
        </View>
      </View>

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
                { backgroundColor: colors.card, shadowColor: colors.shadowColor },
                Shadows.medium,
              ]}
            >
              <ThemedText type="title" style={styles.name}>
                {cat.name}
              </ThemedText>

              <View style={styles.infoGrid}>
                <InfoItem label="品種" value={cat.breed || "未設定"} />
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
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.15)",
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
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
});
