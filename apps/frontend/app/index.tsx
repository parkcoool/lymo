import { ScrollView, View } from "react-native";

import HeroSection from "@/features/home/components/HeroSection";
import PopularTracksSection from "@/features/home/components/PopularTracksSection";
import DeviceMediaDetection from "@/features/home/components/DeviceMediaDetection";

export default function Home() {
  return (
    <ScrollView
      style={{
        flexDirection: "column",
        flex: 1,
      }}
    >
      <View style={{ paddingBottom: 120 }}>
        {/* 알림 구역 */}
        <View style={{ paddingHorizontal: 12 }}>
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
