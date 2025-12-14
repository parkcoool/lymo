import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { UserProvider } from "@/entities/auth/model/userStore";
import { DeviceMediaProvider } from "@/entities/deviceMedia/models/deviceMediaStore";
import SyncDeviceMediaProvider from "@/entities/deviceMedia/ui/SyncDeviceMediaProvider";
import { TrackSourceProvider } from "@/entities/player/models/trackSourceStore";
import { SettingProvider } from "@/entities/setting/models/settingStore";
import { colors } from "@/shared/constants/colors";
import { SyncProvider } from "@/shared/models/syncStore";

import "@/core/firestore";
import "@/core/functions";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <UserProvider>
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
        </UserProvider>

        <StatusBar style="light" translucent backgroundColor="transparent" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
