import { useEffect } from "react";
import { NativeEventEmitter, NativeModules } from "react-native";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import type { MediaModuleType, DeviceMedia } from "@/types/nativeModules";

const MediaModule = NativeModules.MediaModule as MediaModuleType;
const eventEmitter = new NativeEventEmitter(MediaModule);

export default function useDeviceMediaEffect() {
  const { setData: setDeviceMedia, setHasPermission } = useDeviceMediaStore();

  useEffect(() => {
    checkPermission();

    const subscription = eventEmitter.addListener(
      "onMediaDataChanged",
      (newDeviceMedia: DeviceMedia | null) => {
        if (newDeviceMedia == null) return;
        if (newDeviceMedia.duration === 0) return;
        const fixedDeviceMedia = {
          ...newDeviceMedia,
          duration: Math.floor(newDeviceMedia.duration / 1000),
        };

        setDeviceMedia(fixedDeviceMedia);
      }
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
}
