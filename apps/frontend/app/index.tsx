import { ScrollView, View } from "react-native";

import HeroSection from "@/features/home/components/HeroSection";
import PopularTracksSection from "@/features/home/components/PopularTracksSection";

export default function Home() {
  return (
    <ScrollView
      style={{
        flexDirection: "column",
        flex: 1,
      }}
    >
      <View style={{ paddingBottom: 120 }}>
        {/* 최상단 섹션 */}
        <HeroSection />

        {/* 인기 섹션 */}
        <PopularTracksSection />
      </View>
    </ScrollView>
  );
}
