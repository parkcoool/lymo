import type { Track } from "@lymo/schemas/doc";

import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";
import { useSyncStore } from "@/shared/models/syncStore";

/**
 * 곡 감상 핸들러를 반환하는 훅입니다.
 * @returns 곡 감상 핸들러
 */
export default function useHandlePlayTrack() {
  const { setTrackSource } = useTrackSourceStore();
  const { setIsSynced } = useSyncStore();

  const handlePlayTrack = (trackId: string, track: Track) => {
    setTrackSource({
      from: "manual",
      track: { ...track, id: trackId },
    });
    setIsSynced(false);
  };

  return handlePlayTrack;
}
