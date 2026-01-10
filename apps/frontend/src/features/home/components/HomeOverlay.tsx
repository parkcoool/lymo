import useCheckNotificationListenerPermission from "@/entities/deviceMedia/hooks/useCheckNotificationListenerPermission";
import useCheckNotificationPermission from "@/entities/deviceMedia/hooks/useCheckNotificationPermission";
import InsightBottomSheet from "@/entities/home/ui/InsightBottomSheet";
import { useSettingStore } from "@/entities/setting/models/settingStore";

export default function HomeOverlay() {
  const { setting } = useSettingStore();
  const notificationListenerGranted = useCheckNotificationListenerPermission();
  const notificationGranted = useCheckNotificationPermission();

  if (!notificationListenerGranted) return null;
  if (notificationGranted) return null;
  if (setting.notificationFrequency) return null;

  return <InsightBottomSheet />;
}
