import { Stack } from "expo-router";
import React from "react";

import Header from "@/components/shared/Header";
import useSyncDeviceMedia from "@/hooks/useSyncDeviceMedia";

export default function MainLayout() {
  useSyncDeviceMedia();

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          header: (props) => <Header {...props} />,
        }}
      />
    </Stack>
  );
}
