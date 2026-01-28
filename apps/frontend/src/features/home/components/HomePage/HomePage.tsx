import { router, Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/entities/layout/ui/Header";
import NewTracksSection from "@/features/home/components/NewTracksSection";
import PopularTracksSection from "@/features/home/components/PopularTracksSection";

import HomeOverlay from "../HomeOverlay";
import HomeTop from "../HomeTop";

import { styles } from "./styles";

export default function HomePage() {
  const handleSettingOpen = () => router.push("/setting");

  return (
    <>
      <ScrollView style={styles.container}>
        {/* 상단 영역 */}
        <SafeAreaView edges={["top"]} style={styles.safeArea} />

        {/* 상단 구역 */}
        <View style={styles.topSectionContainer}>
          <HomeTop />
        </View>

        <View style={styles.content}>
          {/* 인기 섹션 */}
          <PopularTracksSection />

          {/* 신규 섹션 */}
          <NewTracksSection />
        </View>
      </ScrollView>

      {/* 오버레이 */}
      <HomeOverlay />

      <Stack.Screen
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          header: (props) => (
            <Header {...props} brand onSettingOpen={handleSettingOpen} avatar={false} />
          ),
        }}
      />
    </>
  );
}
