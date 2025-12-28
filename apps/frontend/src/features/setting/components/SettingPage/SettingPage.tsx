import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/entities/layout/ui/Header";

import { styles } from "./styles";

export default function SettingPage() {
  return (
    <>
      <ScrollView style={styles.container}>
        {/* 상단 영역 */}
        <SafeAreaView edges={["top"]} style={styles.safeArea} />

        <View style={styles.content}>
          {/* 설정 항목들 */}
          <View style={styles.itemContainer}></View>
        </View>
      </ScrollView>

      <Stack.Screen
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          header: (props) => <Header {...props} avatar={false} />,
        }}
      />
    </>
  );
}
