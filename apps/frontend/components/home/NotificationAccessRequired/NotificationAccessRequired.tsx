import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

import { MediaModule } from "@/core/mediaModule";

import { styles } from "./NotificationAccessRequired.styles";
import Preview from "./Preview";

export default function NotificationAccessRequired() {
  const [isVisible, setIsVisible] = useState(true);

  // 컴포넌트가 마운트될 때 권한 상태 확인
  useEffect(() => {
    const checkPermission = async () => {
      if (!isVisible) return;
      const granted = await MediaModule.checkNotificationListenerPermission();
      setIsVisible(!granted);
    };

    const intervalRef = setInterval(checkPermission, 5000);
    checkPermission();

    return () => clearInterval(intervalRef);
  }, [isVisible]);

  // 권한 부여 버튼 핸들러
  const handleGrant = () => {
    MediaModule.openNotificationListenerSettings();
  };

  // 닫기 버튼 핸들러
  // const handleClose = () => {
  //   setIsVisible(false);
  // };

  if (!isVisible) return null;

  return (
    <View style={[styles.wrapper]}>
      {/* 닫기 버튼 */}
      {/* <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <MaterialIcons name="close" size={24} style={styles.closeIcon} />
      </TouchableOpacity> */}

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
              현재 재생되는 부분의 가사 해석이 실시간으로 눈앞에 펼쳐집니다.
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
