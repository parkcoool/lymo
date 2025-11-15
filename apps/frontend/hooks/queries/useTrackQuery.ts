import { useSuspenseQuery } from "@tanstack/react-query";

import getTrack from "@/apis/getTrack";

interface UseTrackQuery {
  trackId: string;
}

/**
 * @description 곡 정보를 가져오는 suspenseQuery 훅입니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useTrackQuery({ trackId }: UseTrackQuery) {
  return useSuspenseQuery({
    queryKey: ["track", trackId],
    queryFn: async () => {
      console.log("useTrackQuery called");
      const trackDoc = await getTrack({ trackId });
      return trackDoc;
    },
    staleTime: Infinity,
  });
}
