import { useSuspenseQuery } from "@tanstack/react-query";

import getTrack from "@/apis/getTrack";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

/**
 * @description 사용자가 직접 선택한 곡의 곡 정보를 가져오는 suspenseQuery 훅입니다.
 *
 * `trackSource`의 곡 ID로 곡을 조회합니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useTrackQuery() {
  const { trackSource } = useTrackSourceStore();

  // trackSource에서 곡 ID 가져오기
  const trackId = trackSource?.from === "manual" ? trackSource.track.id : undefined;

  // 쿼리 반환
  return useSuspenseQuery({
    queryKey: ["track", trackId],
    staleTime: Infinity,

    queryFn: async () => {
      if (!trackId) throw new Error("곡 ID가 제공되지 않았습니다.");
      const trackDoc = await getTrack({ trackId });
      return trackDoc;
    },
  });
}
