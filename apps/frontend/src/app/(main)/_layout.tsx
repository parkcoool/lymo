import { Stack } from "expo-router";
import React from "react";

import Header from "@/features/layout/components/Header";

export default function MainLayout() {
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
          header: (props) => <Header {...props} showBrand />,
        }}
      />
    </Stack>
  );
}
