import { useEffect } from "react";

import useCheckNotificationListenerPermission from "@/entities/deviceMedia/hooks/useCheckNotificationListenerPermission";
import useCheckNotificationPermission from "@/entities/deviceMedia/hooks/useCheckNotificationPermission";
import InsightBottomSheet from "@/entities/home/ui/InsightBottomSheet";
import { useSettingStore } from "@/entities/setting/models/settingStore";

export default function HomeOverlay() {
  const { setting } = useSettingStore();
  const { updateSetting } = useSettingStore();

  const notificationListenerGranted = useCheckNotificationListenerPermission();
  const notificationGranted = useCheckNotificationPermission();

  useEffect(() => {
    if (!notificationGranted) return;

    // notificationFrequency가 설정되지 않았다면 'normal'로 설정
    updateSetting((prev) => {
      if (prev.notificationFrequency === undefined)
        return { ...prev, notificationFrequency: "normal" };

      return prev;
    });
  }, [notificationGranted, updateSetting]);

  if (!notificationListenerGranted) return null;
  if (notificationGranted) return null;
  if (setting.notificationFrequency) return null;

  return <InsightBottomSheet />;
}
