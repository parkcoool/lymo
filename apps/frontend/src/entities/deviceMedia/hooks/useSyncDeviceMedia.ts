import { useEffect } from "react";

import MediaNotificationListenerModule, {
  MediaSessionInfo,
} from "modules/media-notification-listener";

import { useDeviceMediaStore } from "@/entities/deviceMedia/models/deviceMediaStore";
import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";
import { useSyncStore } from "@/shared/models/syncStore";
import type { DeviceMedia } from "@/shared/types/DeviceMedia";

/**
 * @description
 * 기기에서 재생되는 미디어를 `deviceMediaStore`에 등록하는 훅입니다.
 * `isSynced`이면 이를 `trackSourceStore`에도 등록합니다.
 */
export default function useSyncDeviceMedia() {
  const { setData: setDeviceMedia } = useDeviceMediaStore();
  const { setTrackSource } = useTrackSourceStore();
  const { isSynced } = useSyncStore();

  useEffect(() => {
    const handleMediaSessionChange = (mediaSessionInfo: MediaSessionInfo) => {
      if (!mediaSessionInfo.hasSession) return;
      const { hasSession, ...mediaSession } = mediaSessionInfo;

      if (mediaSession.durationInMs === 0) return;
      if (mediaSession.artist === "" || mediaSession.title === "") return;

      const deviceMedia: DeviceMedia = {
        title: mediaSession.title,
        artist: mediaSession.artist,
        album: mediaSession.album === "" ? null : mediaSession.album,
        isPlaying: mediaSession.isPlaying,
        albumArtBase64: mediaSession.albumArtBase64,
        durationInSeconds: Math.floor(mediaSession.durationInMs / 1000),
      };

      setDeviceMedia(deviceMedia);
      if (isSynced) setTrackSource({ from: "device", track: deviceMedia });
    };

    const subscription = MediaNotificationListenerModule.addListener(
      "onMediaSessionChanged",
      handleMediaSessionChange
    );

    MediaNotificationListenerModule.startObservingMediaSession()
      .then(async () => {
        console.log("Started observing media session");
        handleMediaSessionChange(await MediaNotificationListenerModule.getCurrentMediaSession());
      })
      .catch((error) => {
        // TODO: 에러 표시
        console.error("Failed to start observing media session:", error);
      });

    return () => {
      if (subscription) subscription.remove();
      MediaNotificationListenerModule.stopObservingMediaSession();
      console.log("Stopped observing media session");
    };

    // setHasPermission, setDeviceMedia와 setTrackSource는 안정적임.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSynced]);
}
