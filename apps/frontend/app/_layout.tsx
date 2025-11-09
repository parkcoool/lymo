import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { colors } from "@/constants/colors";
import { DeviceMediaProvider } from "@/contexts/useDeviceMediaStore";
import { SyncProvider } from "@/contexts/useSyncStore";
import { TrackSourceProvider } from "@/contexts/useTrackSourceStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <DeviceMediaProvider>
          <SyncProvider>
            <TrackSourceProvider>
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
            </TrackSourceProvider>
          </SyncProvider>
        </DeviceMediaProvider>

        <StatusBar style="light" translucent backgroundColor="transparent" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
