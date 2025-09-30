import { View } from "react-native";

import HeroSection from "@/features/home/components/HeroSection";
import PopularTracksSection from "@/features/home/components/PopularTracksSection";

export default function Home() {
  return (
    <View
      style={{
        flexDirection: "column",
      }}
    >
      {/* 최상단 섹션 */}
      <HeroSection />

      {/* 인기 섹션 */}
      <PopularTracksSection />
    </View>
  );
}
