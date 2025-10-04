import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, NativeModules } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { MediaModuleType } from "@/types/nativeModules";

import { styles } from "./NotificationAccessRequired.styles";

const MediaModule = NativeModules.MediaModule as MediaModuleType;

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
    return () => clearInterval(intervalRef);
  }, [isVisible]);

  // 권한 부여 버튼 핸들러
  const handleGrant = () => {
    MediaModule.openNotificationListenerSettings();
  };

  // 닫기 버튼 핸들러
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <View style={[styles.wrapper]}>
      {/* 닫기 버튼 */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <MaterialIcons name="close" size={24} style={styles.closeIcon} />
      </TouchableOpacity>

      {/* 설명 */}
      <View style={styles.body}>
        <Text style={styles.description}>
          {"기기에서 재생하는 곡을 연동하려면 알림 접근 권한이 필요합니다."}
        </Text>
      </View>

      {/* 푸터 */}
      <View style={styles.footer}>
        {/* 권한 부여 버튼 */}
        <TouchableOpacity style={styles.button} onPress={handleGrant}>
          <MaterialIcons
            name={"notifications"}
            size={20}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>{"알림 접근 권한 부여하기"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
