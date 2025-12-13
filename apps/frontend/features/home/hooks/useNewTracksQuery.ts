import { useSuspenseQuery } from "@tanstack/react-query";

import getNewTracks from "@/features/home/api/getNewTracks";

/**
 * @description 신규 등록된 곡을 가져오는 suspenseQuery 훅입니다.
 * @returns suspenseQuery 결과
 */
export default function useNewTracksQuery() {
  return useSuspenseQuery({
    queryKey: ["new-tracks"],
    queryFn: async () => getNewTracks(),
    staleTime: 1000 * 60 * 5,
  });
}
