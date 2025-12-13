import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DeviceMediaProvider } from "@/contexts/useDeviceMediaStore";
import { SettingProvider } from "@/entities/setting/models/store";
import { SyncProvider } from "@/contexts/useSyncStore";
import { TrackSourceProvider } from "@/contexts/useTrackSourceStore";
import SyncDeviceMediaProvider from "@/features/player/components/SyncDeviceMediaProvider";
import { colors } from "@/features/shared/constants/colors";

import "@/core/firestore";
import "@/core/functions";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SettingProvider>
          <DeviceMediaProvider>
            <SyncProvider>
              <TrackSourceProvider>
                <GestureHandlerRootView>
                  <BottomSheetModalProvider>
                    <SyncDeviceMediaProvider>
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
                    </SyncDeviceMediaProvider>
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </TrackSourceProvider>
            </SyncProvider>
          </DeviceMediaProvider>
        </SettingProvider>

        <StatusBar style="light" translucent backgroundColor="transparent" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
