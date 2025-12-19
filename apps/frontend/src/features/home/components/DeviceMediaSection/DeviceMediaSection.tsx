import { View } from "react-native";

import useCheckNotificationListenerPermission from "@/entities/deviceMedia/hooks/useCheckNotificationListenerPermission";
import { useDeviceMediaStore } from "@/entities/deviceMedia/models/deviceMediaStore";
import DeviceMedia from "@/entities/home/ui/DeviceMedia";
import NoDeviceMedia from "@/entities/home/ui/NoDeviceMedia";
import NotificationAccessRequired from "@/entities/home/ui/NotificationAccessRequired";

import { styles } from "./styles";

export default function DeviceMediaSection() {
  return (
    <View style={styles.wrapper}>
      <Content />
    </View>
  );
}

function Content() {
  const { deviceMedia } = useDeviceMediaStore();
  const granted = useCheckNotificationListenerPermission();

  if (!granted) return <NotificationAccessRequired />;
  if (deviceMedia) return <DeviceMedia deviceMedia={deviceMedia} />;

  return <NoDeviceMedia />;
}
