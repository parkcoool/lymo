import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Text } from "react-native";

import { NormalTrackSkeleton } from "@/components/home/Track";

import { styles } from "./PopularTracksSection.styles";

export default function PopularTracksSectionSkeleton() {
  return (
    <View style={styles.section}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <MaterialIcons name="trending-up" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>인기</Text>
      </View>

      {/* 곡 목록 */}
      <View style={styles.skeletonColumn}>
        <View style={styles.skeletonRow}>
          <NormalTrackSkeleton />
          <NormalTrackSkeleton />
        </View>
        <View style={styles.skeletonRow}>
          <NormalTrackSkeleton />
          <NormalTrackSkeleton />
        </View>
        <View style={styles.skeletonRow}>
          <NormalTrackSkeleton />
          <NormalTrackSkeleton />
        </View>
        <View style={styles.skeletonRow}>
          <NormalTrackSkeleton />
          <NormalTrackSkeleton />
        </View>
      </View>
    </View>
  );
}
