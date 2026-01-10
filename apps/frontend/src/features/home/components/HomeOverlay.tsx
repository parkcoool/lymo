import useCheckNotificationListenerPermission from "@/entities/deviceMedia/hooks/useCheckNotificationListenerPermission";
import useCheckNotificationPermissionQuery from "@/entities/deviceMedia/hooks/useCheckNotificationPermissionQuery";
import InsightBottomSheet from "@/entities/home/ui/InsightBottomSheet";
import { useSettingStore } from "@/entities/setting/models/settingStore";

export default function HomeOverlay() {
  const { setting } = useSettingStore();
  const notificationListenerGranted = useCheckNotificationListenerPermission();
  const { data: notificationGranted } = useCheckNotificationPermissionQuery();

  if (!notificationListenerGranted) return null;
  if (notificationGranted) return null;
  if (setting.notificationFrequency) return null;

  return <InsightBottomSheet />;
}
