import { useEffect, useState } from "react";

import type { MediaSessionInfo } from "./MediaNotificationListener.types";
import MediaNotificationListenerModule from "./MediaNotificationListenerModule";

/**
 * 현재 미디어 세션 정보를 가져오고 변경사항을 관찰하는 훅
 */
export function useMediaSession() {
  const [mediaSession, setMediaSession] = useState<MediaSessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 상태 가져오기
    MediaNotificationListenerModule.getCurrentMediaSession()
      .then(setMediaSession)
      .finally(() => setIsLoading(false));

    // 관찰 시작
    const hasPermission = MediaNotificationListenerModule.hasNotificationListenerPermission();
    if (hasPermission) {
      MediaNotificationListenerModule.startObservingMediaSession();
    }

    // 이벤트 리스너 등록
    const subscription = MediaNotificationListenerModule.addListener(
      "onMediaSessionChanged",
      (mediaSessionInfo: MediaSessionInfo) => {
        setMediaSession(mediaSessionInfo);
      }
    );

    return () => {
      subscription.remove();
      MediaNotificationListenerModule.stopObservingMediaSession();
    };
  }, []);

  return { mediaSession, isLoading };
}
