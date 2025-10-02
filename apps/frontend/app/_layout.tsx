import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { colors } from "@/constants/colors";
import Header from "@/shared/components/Header";
import ActiveTrack from "@/shared/components/ActiveTrack";
import useDeviceMediaEffect from "@/shared/hooks/useDeviceMediaEffect";

const queryClient = new QueryClient();

export default function RootLayout() {
  useDeviceMediaEffect();

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
              header: (props) => <Header {...props} />,
              contentStyle: { backgroundColor: colors.background },
            }}
          />

          {/* 활성 트랙 플로팅 */}
          <ActiveTrack />
        </View>

        <StatusBar style="light" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
