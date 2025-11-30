import { Language } from "@lymo/schemas/shared";
import { useQuery } from "@tanstack/react-query";

import getStoryByTrackId from "@/apis/getStoryByTrackId";

interface UseTrackAndStoryQueryParams {
  trackId: string;
  language: Language;
}

/**
 * @description 곡 해석을 가져오는 쿼리 훅입니다.
 * @returns 쿼리 결과
 */
export default function useStoryQuery({ trackId, language }: UseTrackAndStoryQueryParams) {
  return useQuery({
    queryKey: ["story", { language, trackId }],
    queryFn: async () => getStoryByTrackId({ trackId, language }),
  });
}
