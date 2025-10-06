import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { colors } from "@/constants/colors";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            position: "relative",
            backgroundColor: colors.background,
          }}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </View>

        <StatusBar style="light" translucent backgroundColor="transparent" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
