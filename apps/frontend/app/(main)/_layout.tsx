import { Stack } from "expo-router";

import Header from "@/components/shared/Header";
import useSyncDeviceMedia from "@/hooks/useSyncDeviceMedia";

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
