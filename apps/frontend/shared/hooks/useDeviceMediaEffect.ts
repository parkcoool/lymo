import { useEffect } from "react";
import { NativeEventEmitter, NativeModules } from "react-native";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import type { MediaModuleType, MediaData } from "@/types/nativeModules";
import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";

const MediaModule = NativeModules.MediaModule as MediaModuleType;
const eventEmitter = new NativeEventEmitter(MediaModule);

export default function useDeviceMediaEffect() {
  const deviceMediaStore = useDeviceMediaStore();
  const { isSynced, setTrack } = useActiveTrackStore();

  useEffect(() => {
    checkPermission();

    const subscription = eventEmitter.addListener(
      "onMediaDataChanged",
      (data: MediaData | null) => {
        if (data == null) return;

        deviceMediaStore.setData({
          ...data,
          duration: Math.floor(data.duration / 1000),
        });

        if (isSynced) {
          setTrack(data);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [isSynced]);

  const checkPermission = async () => {
    try {
      const isGranted = await MediaModule.checkNotificationListenerPermission();
      deviceMediaStore.setHasPermission(isGranted);
      if (isGranted) {
        MediaModule.startObserver();
      }
    } catch (error) {
      console.error("Failed to check permission", error);
    }
  };
}
