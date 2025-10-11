import { Stack } from "expo-router";

import Header from "@/shared/components/Header";
import useSyncDeviceMedia from "@/shared/hooks/useSyncDeviceMedia";

export default function MainLayout() {
  useSyncDeviceMedia();

  return (
    <Stack
      screenOptions={{
        header: Header,
        headerTransparent: true,
        contentStyle: { backgroundColor: "transparent" },
      }}
    />
  );
}
