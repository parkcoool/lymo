import { LyricsProvider } from "@lymo/schemas/shared";
import { useSuspenseQuery } from "@tanstack/react-query";

import getLyrics from "@/apis/getLyrics";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

/**
 * @description 사용자가 직접 선택한 곡의 가사를 가져오는 suspenseQuery 훅입니다.
 *
 * `trackSource`의 곡 ID로 곡을 조회합니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useLyricsQuery(lyricsProvider: LyricsProvider) {
  const { trackSource } = useTrackSourceStore();

  // trackSource에서 곡 ID 가져오기
  const trackId = trackSource?.from === "manual" ? trackSource.track.id : undefined;

  // 쿼리 반환
  return useSuspenseQuery({
    queryKey: ["lyrics", trackId, lyricsProvider],
    staleTime: Infinity,

    queryFn: async () => {
      if (!trackId) throw new Error("곡 ID가 제공되지 않았습니다.");
      const lyricsDoc = await getLyrics({ trackId, lyricsProvider });
      return lyricsDoc;
    },
  });
}
