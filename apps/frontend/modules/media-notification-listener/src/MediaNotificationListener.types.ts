export interface MediaSession {
  packageName: string;
  title: string;
  artist: string;
  album: string;
  durationInMs: number;
  position: number;
  playbackSpeed: number;
  state:
    | "none"
    | "stopped"
    | "paused"
    | "playing"
    | "fast_forwarding"
    | "rewinding"
    | "buffering"
    | "error"
    | "connecting"
    | "skipping_to_previous"
    | "skipping_to_next"
    | "skipping_to_queue_item";
  isPlaying: boolean;
  albumArtBase64?: string;
}

export type MediaSessionInfo =
  | {
      hasSession: false;
    }
  | ({
      hasSession: true;
    } & MediaSession);

export type MediaNotificationListenerModuleEvents = {
  onMediaSessionChanged: (mediaSessionInfo: MediaSessionInfo) => void;
};
