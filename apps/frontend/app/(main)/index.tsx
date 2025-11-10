import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DeviceMediaDetection from "@/components/home/DeviceMediaDetection";
import HeroSection from "@/components/home/HeroSection";
import NotificationAccessRequired from "@/components/home/NotificationAccessRequired";
import PopularTracksSection from "@/components/home/PopularTracksSection";

export default function Home() {
  return (
    <ScrollView
      style={{
        flexDirection: "column",
        flex: 1,
      }}
      stickyHeaderIndices={[0]}
    >
      <View>
        {/* 상단 영역 */}
        <SafeAreaView edges={["top"]} style={{ paddingTop: 60 }} />

        {/* 알림 구역 */}
        <View style={{ padding: 12 }}>
          <NotificationAccessRequired />
          <DeviceMediaDetection />
        </View>
      </View>

      {/* 최상단 섹션 */}
      <HeroSection />

      {/* 인기 섹션 */}
      <PopularTracksSection />
    </ScrollView>
  );
}
