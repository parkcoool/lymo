import type { Track, TrackDetail } from "@lymo/schemas/shared";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import getTrack from "@/apis/getTrack";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

/**
 * @description 사용자가 직접 선택한 곡의 곡 정보를 가져오는 suspenseQuery 훅입니다.
 *
 * `trackSource`의 곡 ID로 곡을 조회합니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useManualTrackQuery() {
  const { trackSource } = useTrackSourceStore();

  // trackSource에서 곡 ID 가져오기
  const trackId = useMemo(() => {
    if (trackSource?.from === "manual") return trackSource.track.id;
    else return undefined;
  }, [trackSource]);

  // 쿼리 반환
  const query = useSuspenseQuery<Track & TrackDetail>({
    queryKey: ["track", "manual", trackId],
    staleTime: Infinity,

    queryFn: () => {
      if (!trackId) throw new Error("곡 ID가 제공되지 않았습니다.");
      return getTrack({ trackId });
    },
  });

  if (query.isError) {
    throw query.error;
  }

  return query;
}
