import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View, Text } from "react-native";

import { MediaModule } from "@/core/mediaModule";
import useCheckNotificationListenerPermission from "@/entities/deviceMedia/hooks/useCheckNotificationListenerPermission";

import Preview from "./Preview";
import { styles } from "./styles";

export default function NotificationAccessRequired() {
  const granted = useCheckNotificationListenerPermission();

  if (granted) return null;

  // 권한 부여 버튼 핸들러
  const handleGrant = () => {
    MediaModule.openNotificationListenerSettings();
  };

  return (
    <View style={[styles.wrapper]}>
      {/* 미리보기 */}
      <Preview />

      {/* 오버레이 */}
      <View style={styles.overlay} />

      {/* 설명 */}
      <LinearGradient
        style={styles.body}
        colors={["transparent", "#000000CC"]}
        start={[0, 0]}
        end={[0, 0.3]}
      >
        <Text style={styles.title}>지금 듣는 곡을 깊이 있게 감상해보세요.</Text>

        <View style={styles.descriptionContainer}>
          <View style={styles.descriptionWrapper}>
            <MaterialIcons name="auto-awesome" size={16} style={styles.descriptionIcon} />
            <Text style={styles.descriptionText}>기기에서 재생되는 곡을 자동으로 감지합니다.</Text>
          </View>
          <View style={styles.descriptionWrapper}>
            <MaterialIcons name="audiotrack" size={16} style={styles.descriptionIcon} />
            <Text style={styles.descriptionText}>
              현재 재생되는 부분의 가사 해석이 실시간으로 제공됩니다.
            </Text>
          </View>
        </View>

        {/* 푸터 */}
        <View style={styles.footer}>
          {/* 권한 부여 버튼 */}
          <TouchableOpacity style={styles.button} onPress={handleGrant}>
            <MaterialIcons name="start" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>시작하기</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
