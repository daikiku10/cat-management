import { Stack } from "expo-router";

export default function CatsLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={{
          title: "猫を登録",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "編集",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
