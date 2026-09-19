import { Stack } from "expo-router";

export default function CatsLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="create"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen name="feeding-logs/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="poop-logs/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
