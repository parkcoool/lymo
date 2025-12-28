import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState, AppStateStatus, Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { UserProvider } from "@/entities/auth/model/userStore";
import { DeviceMediaProvider } from "@/entities/deviceMedia/models/deviceMediaStore";
import SyncDeviceMediaProvider from "@/entities/deviceMedia/ui/SyncDeviceMediaProvider";
import { FavoriteProvider } from "@/entities/player/models/favoriteStore";
import { TrackSourceProvider } from "@/entities/player/models/trackSourceStore";
import { SettingProvider } from "@/entities/setting/models/settingStore";
import { colors } from "@/shared/constants/colors";
import { SyncProvider } from "@/shared/models/syncStore";

import "@/core/firestore";
import "@/core/functions";
import "@/core/auth";
import "@/core/headlessTask";
import "@/core/database";

const queryClient = new QueryClient();

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function RootLayout() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <UserProvider>
          <SettingProvider>
            <DeviceMediaProvider>
              <SyncProvider>
                <TrackSourceProvider>
                  <FavoriteProvider>
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
                                contentStyle: { backgroundColor: "transparent" },
                              }}
                            />
                          </View>
                        </SyncDeviceMediaProvider>
                      </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                  </FavoriteProvider>
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
