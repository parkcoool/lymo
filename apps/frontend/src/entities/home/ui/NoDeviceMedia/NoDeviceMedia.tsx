import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Text } from "react-native";

import Background from "./Background";
import { styles } from "./styles";

export default function NoDeviceMedia() {
  return (
    <View style={styles.wrapper}>
      {/* 배경화면 */}
      <Background />

      {/* 설명 */}
      <View style={styles.body}>
        <View style={styles.titleWrapper}>
          <MaterialIcons name="radar" size={24} style={styles.titleIcon} />
          <Text style={styles.title}>음악 감지 중</Text>
        </View>
        <Text style={styles.descriptionText}>
          기기에서 음악을 재생하면, 자동으로 음악 정보를 인식해서 여기에 표시할게요.
        </Text>
      </View>
    </View>
  );
}
