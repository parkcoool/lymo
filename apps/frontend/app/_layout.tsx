import Header from "@/shared/components/Header";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}
      />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
