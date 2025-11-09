import type { Track, TrackDetail } from "@lymo/schemas/shared";
import {
  useSuspenseQuery,
  experimental_streamedQuery as streamedQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";

import addTrack from "@/apis/addTrack";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

/**
 * @description 기기에서 재생 중인 미디어로 곡 정보를 가져오는 suspenseQuery 훅입니다.
 *
 * `trackSourceStore`의 곡 정보로 곡을 조회합니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useDeviceTrackQuery() {
  const { trackSource } = useTrackSourceStore();

  // trackSource에서 곡 조회에 필요한 정보 가져오기
  const trackStreamKey = useMemo(() => {
    if (trackSource?.from === "device")
      return {
        title: trackSource.track.title,
        artist: trackSource.track.artist,
        duration: trackSource.track.duration,
      };
    else return undefined;
  }, [trackSource]);

  // 쿼리 반환
  const query = useSuspenseQuery({
    queryKey: ["track", "stream", trackStreamKey],

    queryFn: streamedQuery<Track & TrackDetail, Track & TrackDetail>({
      initialValue: {
        id: "",
        title: "",
        artist: "",
        album: null,
        coverUrl: "",
        publishedAt: null,
        duration: 0,
        lyrics: [],
        lyricsProvider: "",
        summary: "",
      },
      reducer: (_, chunk) => chunk,
      streamFn: () => {
        if (trackStreamKey) return addTrack(trackStreamKey);
        else throw new Error("곡 정보가 제공되지 않았습니다.");
      },
    }),
  });

  if (query.isError) {
    throw query.error;
  }

  return query;
}
