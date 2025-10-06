import { Stack } from "expo-router";

import Header from "@/shared/components/Header";
import useDeviceMediaEffect from "@/shared/hooks/useDeviceMediaEffect";

export default function MainLayout() {
  useDeviceMediaEffect();

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
