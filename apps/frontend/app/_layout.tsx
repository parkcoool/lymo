import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import SyncDeviceMediaProvider from "@/components/shared/SyncDeviceMediaProvider";
import { colors } from "@/constants/colors";
import { DeviceMediaProvider } from "@/contexts/useDeviceMediaStore";
import { SettingProvider } from "@/contexts/useSettingStore";
import { SyncProvider } from "@/contexts/useSyncStore";
import { TrackSourceProvider } from "@/contexts/useTrackSourceStore";

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
