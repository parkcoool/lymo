import { View, Text, ScrollView } from "react-native";
import HeroSection from "@/features/home/components/HeroSection";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { styles } from "./index.styles";
import { CompactTrack } from "@/features/track/components/Track";

export default function Home() {
  return (
    <View style={styles.container}>
      {/* 최상단 섹션 */}
      <HeroSection />

      {/* 인기 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons
            name="trending-up"
            size={24}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>인기</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.sectionContent}
          horizontal
        ></ScrollView>
      </View>
    </View>
  );
}
