import { useSuspenseQueries } from "@tanstack/react-query";

import getProviders from "@/apis/getProvider";
import getTrack from "@/apis/getTrack";

interface UseTrackAndProvidersQueriesQueries {
  trackId: string;
}

/**
 * @description 곡 정보와 제공자 목록을 가져오는 suspenseQueries 훅입니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useTrackAndProvidersQueries({
  trackId,
}: UseTrackAndProvidersQueriesQueries) {
  // 쿼리 반환
  return useSuspenseQueries({
    queries: [
      // 곡 정보
      {
        queryKey: ["track", trackId],
        queryFn: async () => {
          const trackDoc = await getTrack({ trackId });
          return trackDoc;
        },
      },

      // 제공자 목록
      {
        queryKey: ["providers", trackId],
        queryFn: async () => {
          const providers = await getProviders({ trackId });
          return providers;
        },
      },
    ],

    combine: (results) => {
      return {
        trackQuery: results[0],
        providersQuery: results[1],
      };
    },
  });
}
