import { useSuspenseQuery } from "@tanstack/react-query";

import getPopularTracks from "@/apis/getPopularTracks";

/**
 * @description 인기있는 곡을 가져오는 suspenseQuery 훅입니다.
 * @returns suspenseQuery 결과
 */
export default function usePopularTracksQuery() {
  return useSuspenseQuery({
    queryKey: ["popular-tracks"],
    queryFn: async () => getPopularTracks(),
  });
}
