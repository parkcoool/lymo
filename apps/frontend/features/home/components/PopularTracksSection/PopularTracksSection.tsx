import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Suspense } from "react";
import { View, Text } from "react-native";

import Fallback from "../NewTracksSection/Fallback";

import ItemList from "./ItemList";
import { styles } from "./styles";

export default function PopularTracksSection() {
  return (
    <View style={styles.section}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <MaterialIcons name="trending-up" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>인기</Text>
      </View>

      {/* 곡 목록 */}
      <Suspense fallback={<Fallback />}>
        <ItemList />
      </Suspense>
    </View>
  );
}
