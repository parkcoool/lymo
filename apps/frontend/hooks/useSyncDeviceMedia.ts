import { useEffect } from "react";
import { EmitterSubscription, NativeEventEmitter } from "react-native";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { useSyncStore } from "@/contexts/useSyncStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import { MediaModule } from "@/core/mediaModule";
import type { DeviceMedia } from "@/types/mediaModule";

const eventEmitter = new NativeEventEmitter(MediaModule);

const startObserver = async (setHasPermission: (value: boolean) => void) => {
  try {
    const isGranted = await MediaModule.checkNotificationListenerPermission();
    setHasPermission(isGranted);

    if (isGranted) return await MediaModule.startObserver();
  } catch (error) {
    console.error("Failed to check permission", error);
  }

  setHasPermission(false);
  return false;
};

/**
 * @description
 * 기기에서 재생되는 미디어를 `deviceMediaStore`에 등록하는 훅입니다.
 * `isSynced`이면 이를 `trackSourceStore`에도 등록합니다.
 */
export default function useSyncDeviceMedia() {
  const { setData: setDeviceMedia, setHasPermission } = useDeviceMediaStore();
  const { setTrackSource } = useTrackSourceStore();
  const { isSynced } = useSyncStore();

  useEffect(() => {
    let subscription: EmitterSubscription;

    (async () => {
      while (true) {
        const success = await startObserver(setHasPermission);

        // 시작에 실패했으면 5초 후에 재시도
        if (!success) {
          console.warn("Failed to start media observer");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }

        // 성공적으로 시작
        else {
          console.log("Media observer started");

          // 이벤트 리스너 등록
          subscription = eventEmitter.addListener(
            "onMediaDataChanged",
            (newDeviceMedia: DeviceMedia | null) => {
              if (newDeviceMedia == null) return;
              if (newDeviceMedia.duration === 0) return;
              const fixedDeviceMedia = {
                ...newDeviceMedia,
                duration: Math.floor(newDeviceMedia.duration / 1000),
              };

              setDeviceMedia(fixedDeviceMedia);
              if (isSynced) setTrackSource({ from: "device", track: fixedDeviceMedia });
            }
          );

          // 성공적으로 시작했으므로 루프 종료
          break;
        }
      }
    })();

    return () => {
      if (subscription) subscription.remove();
    };
    // setHasPermission, setDeviceMedia와 setTrackSource는 안정적임.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSynced]);
}
