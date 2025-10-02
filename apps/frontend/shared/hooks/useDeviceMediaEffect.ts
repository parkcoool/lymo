import { useEffect, useRef } from "react";
import { NativeEventEmitter, NativeModules } from "react-native";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import type { MediaModuleType } from "@/types/nativeModules";

const MediaModule = NativeModules.MediaModule as MediaModuleType;
const eventEmitter = new NativeEventEmitter(MediaModule);

export default function useDeviceMediaEffect() {
  const intervalRef = useRef<number | null>(null);

  const deviceMediaStore = useDeviceMediaStore();
  const isPlaying = deviceMediaStore.data?.isPlaying ?? false;

  useEffect(() => {
    checkPermission();

    const subscription = eventEmitter.addListener(
      "onMediaDataChanged",
      (data) => {
        if (data == null) return;

        deviceMediaStore.setData({
          ...data,
          duration: Math.floor(data.duration / 1000),
        });
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // 재생 상태에 따라 1초마다 재생 위치 갱신
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(async () => {
        const position = Math.floor((await getPosition()) / 1000);
        deviceMediaStore.setTimestamp(position);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying]);

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

  const getPosition = async (): Promise<number> => {
    try {
      return Math.floor((await MediaModule.getCurrentPosition()) / 1000);
    } catch (error) {
      return 0;
    }
  };
}
