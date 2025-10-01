import { useEffect, useState } from "react";
import { NativeEventEmitter, NativeModules } from "react-native";

import type { MediaModuleType, MediaData } from "@/types/nativeModules";

const MediaModule = NativeModules.MediaModule as MediaModuleType;
const eventEmitter = new NativeEventEmitter(MediaModule);

export default function useDeviceMedia() {
  const [deviceMedia, setDeviceMedia] = useState<MediaData | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();

    const subscription = eventEmitter.addListener(
      "onMediaDataChanged",
      setDeviceMedia
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const checkPermission = async () => {
    try {
      const isGranted = await MediaModule.checkNotificationListenerPermission();
      setHasPermission(isGranted);
      if (isGranted) {
        MediaModule.startObserver();
      }
    } catch (error) {
      console.error("Failed to check permission", error);
    }
  };

  const getPosition = async (): Promise<number> => {
    try {
      return Math.floor((await MediaModule.getCurrentPosition()) / 1000);
    } catch (error) {
      return -1;
    }
  };

  const openSettings = () => {
    MediaModule.openNotificationListenerSettings();
  };

  return { deviceMedia, hasPermission, getPosition, openSettings };
}
