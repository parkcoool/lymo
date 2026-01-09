import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

import MediaNotificationListenerModule from "modules/media-notification-listener";
import useCheckNotificationListenerPermission from "@/entities/deviceMedia/hooks/useCheckNotificationListenerPermission";
import { useSettingStore } from "@/entities/setting/models/settingStore";
import { SettingItem, SettingToggleItem } from "@/entities/setting/ui/SettingItem";
import getNotificationFrequencyText from "@/entities/setting/utils/getNotificationFrequencyText";

import { styles } from "./styles";

export default function Sync() {
  const { setting } = useSettingStore();
  const granted = useCheckNotificationListenerPermission();

  const handleToggle = () => {
    MediaNotificationListenerModule.openNotificationListenerSettings();
  };

  const handleUpdateInsightNotification = () => {
    router.push("/setting/insight");
  };

  return (
    <>
      {/* 기기 음악 연동 */}
      <SettingToggleItem
        icon={<MaterialIcons name="music-note" style={styles.icon} size={24} />}
        title="기기 음악 연동"
        description="재생 중인 음악 정보를 인식하기"
        value={granted}
        onValueChange={handleToggle}
      />

      {/* 인사이트 알림 */}
      <SettingItem
        icon={<MaterialIcons name="notifications" style={styles.icon} size={24} />}
        title="인사이트 알림"
        description={getNotificationFrequencyText(setting.notificationFrequency)}
        disabled={!granted}
        onPress={handleUpdateInsightNotification}
      />
    </>
  );
}
