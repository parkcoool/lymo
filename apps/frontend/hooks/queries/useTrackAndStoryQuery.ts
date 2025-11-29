import { Language } from "@lymo/schemas/shared";
import { useQueries } from "@tanstack/react-query";

import getStoryByTrackId from "@/apis/getStoryByTrackId";
import getTrackById from "@/apis/getTrackById";

interface UseTrackAndStoryQueryParams {
  trackId: string;
  language: Language;
}

/**
 * @description 곡과 해석을 가져오는 쿼리 훅입니다.
 * @returns 쿼리 결과
 */
export default function useTrackAndStoryQuery({ trackId, language }: UseTrackAndStoryQueryParams) {
  return useQueries({
    queries: [
      {
        queryKey: ["track", trackId],
        queryFn: async () => {
          const track = await getTrackById(trackId);
          if (!track) throw new Error("곡을 찾을 수 없습니다.");
          return track;
        },
        throwOnError: true,
      },

      {
        queryKey: ["story", { language, trackId }],
        queryFn: async () => getStoryByTrackId({ trackId, language }),
      },
    ],
  });
}
