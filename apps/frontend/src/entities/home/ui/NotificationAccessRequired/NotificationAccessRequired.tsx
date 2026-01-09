import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View, Text } from "react-native";

import MediaNotificationListenerModule from "modules/media-notification-listener";

import GradientFill from "@/shared/components/GradientFill";

import Background from "./Background";
import { styles } from "./styles";

export default function NotificationAccessRequired() {
  // 권한 부여 버튼 핸들러
  const handleGrant = () => {
    MediaNotificationListenerModule.openNotificationListenerSettings();
  };

  return (
    <View style={styles.wrapper}>
      {/* 배경화면 */}
      <Background />

      {/* 오버레이 */}
      <View style={styles.overlay} />

      {/* 설명 */}
      <LinearGradient
        style={styles.body}
        colors={["transparent", "#000000E0"]}
        start={[0, 0]}
        end={[0, 0.5]}
      >
        <View style={styles.titleWrapper}>
          <MaterialIcons name="auto-awesome" style={styles.titleIcon} size={32} />
          <GradientFill
            gradientOptions={{
              colors: ["#a9ffef", "#deb2ff"],
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0 },
            }}
          >
            <Text style={styles.title}>지금 듣고 있는 음악을 AI가 실시간으로 해석해줘요.</Text>
          </GradientFill>
        </View>

        <Text style={styles.descriptionText}>
          알림 접근 권한을 허용해주시면, 듣고 있는 음악을 자동으로 인식할게요.
        </Text>

        {/* 푸터 */}
        <View style={styles.footer}>
          {/* 권한 부여 버튼 */}
          <TouchableOpacity style={styles.button} onPress={handleGrant}>
            <MaterialIcons name="notifications" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>알림 접근 허용하기</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
