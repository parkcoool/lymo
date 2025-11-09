import { useEffect } from "react";
import { NativeEventEmitter, NativeModules } from "react-native";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import { useSyncStore } from "@/contexts/useSyncStore";
import { MediaModule } from "@/core/mediaModule";
import type { DeviceMedia } from "@/types/mediaModule";

const eventEmitter = new NativeEventEmitter(MediaModule);

export default function useSyncDeviceMedia() {
  const { setData: setDeviceMedia, setHasPermission } = useDeviceMediaStore();
  const { setTrackSource } = useTrackSourceStore();
  const { isSynced } = useSyncStore();

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

        if (isSynced)
          setTrackSource({ from: "device", track: fixedDeviceMedia });
      }
    );

    return () => {
      subscription.remove();
    };
  }, [isSynced]);

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
