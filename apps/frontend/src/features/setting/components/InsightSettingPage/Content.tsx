import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Text, TouchableOpacity } from "react-native";

import MediaInsightServiceModule from "modules/media-insight-service";

import useCheckNotificationPermission from "@/entities/deviceMedia/hooks/useCheckNotificationPermission";
import InsightAnimation from "@/entities/home/ui/InsightAnimation";
import { useSettingStore } from "@/entities/setting/models/settingStore";
import { Setting } from "@/entities/setting/models/types";
import getNotificationFrequencyText from "@/entities/setting/utils/getNotificationFrequencyText";

import Option from "./Option";
import { styles } from "./styles";

export default function Content() {
  const { updateSetting, setting } = useSettingStore();
  const granted = useCheckNotificationPermission();

  // 권한 부여 버튼 핸들러
  const handleGrant = async () => {
    MediaInsightServiceModule.requestPostNotificationPermission();
  };

  // 옵션 변경 핸들러
  const handleChange = (value: Setting["notificationFrequency"]) => {
    updateSetting((prev) => ({ ...prev, notificationFrequency: value }));
  };

  if (!granted)
    return (
      <>
        <InsightAnimation />

        <View style={styles.permissionContainer}>
          <Text style={styles.description}>
            인사이트 알림을 받으려면 먼저 알림 권한을 허용해주세요.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleGrant}>
            <MaterialIcons name="notifications" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>알림 허용하기</Text>
          </TouchableOpacity>
        </View>
      </>
    );

  return (
    <View style={styles.optionContainer}>
      <Option
        title={getNotificationFrequencyText("always")}
        description="가능한 모든 음악에 대해 인사이트 알림을 항상 받을게요."
        value={setting.notificationFrequency === "always"}
        onPress={() => handleChange("always")}
        disabled={!granted}
      />
      <Option
        title={getNotificationFrequencyText("normal")}
        description="인사이트 알림을 자주 받을게요."
        value={setting.notificationFrequency === "normal"}
        onPress={() => handleChange("normal")}
        disabled={!granted}
      />
      <Option
        title={getNotificationFrequencyText("minimal")}
        description="인사이트 알림을 가끔 받을게요."
        value={setting.notificationFrequency === "minimal"}
        onPress={() => handleChange("minimal")}
        disabled={!granted}
      />
      <Option
        title={getNotificationFrequencyText("never")}
        description="인사이트 알림을 받지 않을게요."
        value={setting.notificationFrequency === "never"}
        onPress={() => handleChange("never")}
        disabled={!granted}
      />
    </View>
  );
}
