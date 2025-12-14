import { Track } from "@lymo/schemas/doc";

import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";

/**
 * 주어진 곡 정보와 기기에서 재생 중인 곡 정보를 병합하는 훅입니다.
 */
export default function useMergedTrack(track: Partial<Track>): Partial<Track> {
  const { trackSource } = useTrackSourceStore();

  // 기기에서 재생 중인 곡 정보 처리
  const track1: Partial<Track> = {};
  if (trackSource?.from === "device") {
    const { isPlaying, duration, artist, id, ...overlap } = trackSource.track;
    Object.assign(track1, { ...overlap, durationInSeconds: duration, artists: [artist] });
  }

  // 주어진 곡 정보 처리
  const track2 = Object.fromEntries(
    Object.entries(track).filter(([_, value]) => value !== undefined && value !== null)
  );
  return { ...track1, ...track2 };
}
