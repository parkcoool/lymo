import { Stack } from "expo-router";

import Header from "@/entities/layout/ui/Header";

export default function SettingLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack
        screenOptions={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          header: (props) => {
            return <Header {...props} avatar={false} />;
          },
        }}
      />
    </>
  );
}
