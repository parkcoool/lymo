import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React, { useRef } from "react";

import Header from "@/components/shared/Header";
import SettingBottomSheet from "@/components/shared/SettingBottomSheet";
import useSyncDeviceMedia from "@/hooks/useSyncDeviceMedia";

export default function MainLayout() {
  useSyncDeviceMedia();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const handleSettingsOpen = () => bottomSheetRef.current?.present();

  return (
    <>
      <Stack
        screenOptions={{
          header: (props) => (
            <Header {...props} onSettingsPress={handleSettingsOpen} />
          ),
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />

      {/* 설정 바텀시트 */}
      <SettingBottomSheet ref={bottomSheetRef} />
    </>
  );
}
