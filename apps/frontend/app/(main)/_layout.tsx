import { Stack } from "expo-router";

import Header from "@/shared/components/Header";
import useDeviceMediaEffect from "@/shared/hooks/useDeviceMediaEffect";
import useStreamAddTrackEffect from "@/shared/hooks/useStreamAddTrackEffect";

export default function MainLayout() {
  useDeviceMediaEffect();
  useStreamAddTrackEffect();

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
