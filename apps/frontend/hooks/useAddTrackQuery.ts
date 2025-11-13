import { useSuspenseQuery } from "@tanstack/react-query";

import addTrack from "@/apis/addTrack";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

/**
 * @description 기기에서 재생 중인 미디어로 곡 정보와 가사 원문을 가져오는 suspenseQuery 훅입니다.
 *
 * `trackSourceStore`의 곡 정보로 곡을 조회합니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useAddTrackQuery() {
  const { trackSource } = useTrackSourceStore();

  // trackSource에서 곡 조회에 필요한 정보 가져오기
  const trackKey =
    trackSource?.from === "device"
      ? {
          title: trackSource.track.title,
          artist: trackSource.track.artist,
          duration: trackSource.track.duration,
        }
      : undefined;

  // 쿼리 반환
  return useSuspenseQuery({
    queryKey: ["track", "stream", trackKey],

    queryFn: async () => {
      if (!trackKey) throw new Error("곡 정보가 없습니다.");
      const result = await addTrack(trackKey);
      if (result.notFound) throw new Error("곡을 찾을 수 없습니다.");
      return result;
    },

    staleTime: Infinity,
  });
}
