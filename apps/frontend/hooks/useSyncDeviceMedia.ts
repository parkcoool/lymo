import { useEffect } from "react";
import { NativeEventEmitter } from "react-native";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { useSyncStore } from "@/contexts/useSyncStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import { MediaModule } from "@/core/mediaModule";
import type { DeviceMedia } from "@/types/mediaModule";

const eventEmitter = new NativeEventEmitter(MediaModule);

const checkPermission = async (setHasPermission: (value: boolean) => void) => {
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

export default function useSyncDeviceMedia() {
  const { setData: setDeviceMedia, setHasPermission } = useDeviceMediaStore();
  const { setTrackSource } = useTrackSourceStore();
  const { isSynced } = useSyncStore();

  useEffect(() => {
    checkPermission(setHasPermission);

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
    // setHasPermission, setDeviceMedia와 setTrackSource는 안정적임.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSynced]);
}
