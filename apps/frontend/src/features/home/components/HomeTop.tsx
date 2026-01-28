import useCheckNotificationListenerPermission from "@/entities/deviceMedia/hooks/useCheckNotificationListenerPermission";
import { useDeviceMediaStore } from "@/entities/deviceMedia/models/deviceMediaStore";
import DeviceMedia from "@/entities/home/ui/DeviceMedia";
import NoDeviceMedia from "@/entities/home/ui/NoDeviceMedia";
import NotificationAccessRequired from "@/entities/home/ui/NotificationAccessRequired";

export default function HomeTop() {
  const { deviceMedia } = useDeviceMediaStore();
  const granted = useCheckNotificationListenerPermission();

  if (!granted) return <NotificationAccessRequired />;
  if (deviceMedia) return <DeviceMedia deviceMedia={deviceMedia} />;

  return <NoDeviceMedia />;
}
