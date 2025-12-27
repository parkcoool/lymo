import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/entities/layout/ui/Header";
import NewTracksSection from "@/features/home/components/NewTracksSection";
import PopularTracksSection from "@/features/home/components/PopularTracksSection";

import DeviceMediaSection from "../DeviceMediaSection";
import NotificationBottomSheet from "../NotificationBottomSheet";

import { styles } from "./styles";

export default function HomePage() {
  return (
    <>
      <ScrollView style={styles.container}>
        {/* 상단 영역 */}
        <SafeAreaView edges={["top"]} style={styles.safeArea} />

        <View style={styles.topSectionContainer}>
          {/* 기기 미디어 구역 */}
          <DeviceMediaSection />
        </View>

        <View style={styles.content}>
          {/* 인기 섹션 */}
          <PopularTracksSection />

          {/* 신규 섹션 */}
          <NewTracksSection />
        </View>

        {/* 알림 바텀시트 */}
        <NotificationBottomSheet />
      </ScrollView>

      <Stack.Screen
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          header: (props) => <Header {...props} brand />,
        }}
      />
    </>
  );
}
