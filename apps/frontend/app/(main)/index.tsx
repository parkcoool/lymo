import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HeroSection from "@/features/home/components/HeroSection";
import PopularTracksSection from "@/features/home/components/PopularTracksSection";
import DeviceMediaDetection from "@/features/home/components/DeviceMediaDetection";
import NotificationAccessRequired from "@/features/home/components/NotificationAccessRequired";

export default function Home() {
  return (
    <ScrollView
      style={{
        flexDirection: "column",
        flex: 1,
      }}
    >
      <View>
        {/* 상단 영역 */}
        <SafeAreaView edges={["top"]} style={{ paddingTop: 60 }} />

        {/* 알림 구역 */}
        <View style={{ padding: 12 }}>
          <NotificationAccessRequired />
          <DeviceMediaDetection />
        </View>

        {/* 최상단 섹션 */}
        <HeroSection />

        {/* 인기 섹션 */}
        <PopularTracksSection />
      </View>
    </ScrollView>
  );
}
