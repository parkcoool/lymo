import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Text } from "react-native";

import Skeleton from "@/components/shared/Skeleton";

import { styles } from "./NewTracksSection.styles";

export default function NewTracksSectionSkeleton() {
  return (
    <View style={styles.section}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <MaterialIcons name="new-releases" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>신규 등록</Text>
      </View>

      {/* 곡 목록 */}
      <View style={styles.sectionContent}>
        <Skeleton width={140} height={140} borderRadius={8} />
        <Skeleton width={140} height={140} borderRadius={8} />
        <Skeleton width={140} height={140} borderRadius={8} />
        <Skeleton width={140} height={140} borderRadius={8} />
      </View>
    </View>
  );
}
