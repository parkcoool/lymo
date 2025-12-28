import useCheckNotificationListenerPermission from "@/entities/deviceMedia/hooks/useCheckNotificationListenerPermission";
import useCheckNotificationPermission from "@/entities/deviceMedia/hooks/useCheckNotificationPermission";
import InsightBottomSheet from "@/entities/home/ui/InsightBottomSheet";
import { useSettingStore } from "@/entities/setting/models/settingStore";

export default function HomeOverlay() {
  const { setting } = useSettingStore();
  const notificaitonListenerGranted = useCheckNotificationListenerPermission();
  const notificaitonGranted = useCheckNotificationPermission();

  if (!notificaitonListenerGranted) return null;
  if (notificaitonGranted) return null;
  if (setting.notificationFrequency) return null;

  return <InsightBottomSheet />;
}
