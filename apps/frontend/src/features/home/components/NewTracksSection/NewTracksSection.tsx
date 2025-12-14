import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Suspense } from "react";
import { View, Text } from "react-native";

import Fallback from "./Fallback";
import ItemList from "./ItemList";
import { styles } from "./styles";

export default function NewTracksSection() {
  return (
    <View style={styles.section}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <MaterialIcons name="new-releases" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>신규 등록</Text>
      </View>

      {/* 곡 목록 */}
      <Suspense fallback={<Fallback />}>
        <ItemList />
      </Suspense>
    </View>
  );
}
