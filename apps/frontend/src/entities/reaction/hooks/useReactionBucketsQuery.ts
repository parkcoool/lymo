import { useQuery } from "@tanstack/react-query";

import getReactionBuckets from "../apis/getReactionBuckets";

interface UseReactionBucketsQueryParams {
  storyId: string;
}

/**
 * 반응 bucket들을 가져오는 쿼리 훅입니다.
 * @returns 쿼리 결과
 */
export default function useReactionBucketsQuery({ storyId }: UseReactionBucketsQueryParams) {
  return useQuery({
    queryKey: ["reaction-buckets", storyId],
    queryFn: async () => {
      return getReactionBuckets({ storyId });
    },
    staleTime: (query) => (query.state.data?.length ?? 0 > 0 ? Infinity : 0),
  });
}
