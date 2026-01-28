import { RetrieveTrackInput } from "@lymo/schemas/functions";
import { useQuery } from "@tanstack/react-query";

import retrieveTrack from "@/entities/track/api/retrieveTrack";
import KnownError from "@/shared/errors/KnownError";

/**
 * retrieveTrack를 호출하는 쿼리 훅입니다.
 * @returns 쿼리 결과
 */
export default function useRetrieveTrack(params: RetrieveTrackInput) {
  return useQuery({
    queryKey: ["retrieve-track", params],
    queryFn: async () => retrieveTrack(params),
    select: (res) => {
      if (res.data.success) return res.data.data;
      throw new KnownError(res.data.error, res.data.message);
    },
    throwOnError: true,
    staleTime: 1000 * 60 * 5,
  });
}
