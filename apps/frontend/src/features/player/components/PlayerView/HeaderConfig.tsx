import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useRef } from "react";

import Header from "@/entities/layout/ui/Header";
import SettingBottomSheet from "@/entities/setting/components/SettingBottomSheet";

interface HeaderConfigProps {
  backgroundColor: string;
}

export default function HeaderConfig({ backgroundColor }: HeaderConfigProps) {
  const settingBottomSheetRef = useRef<BottomSheetModal>(null);

  const handleSettingOpen = () => {
    settingBottomSheetRef.current?.present();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          header: (props) => (
            <Header
              {...props}
              backgroundColor={backgroundColor}
              avatar={false}
              onSettingOpen={handleSettingOpen}
            />
          ),
        }}
      />

      <SettingBottomSheet ref={settingBottomSheetRef} />
    </>
  );
}
