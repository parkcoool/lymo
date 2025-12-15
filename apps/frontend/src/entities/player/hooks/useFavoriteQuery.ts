import { useSuspenseQuery } from "@tanstack/react-query";

import { useUserStore } from "@/entities/auth/model/userStore";

import getFavorite from "../apis/getFavorite";

interface UseFavoriteQueryParams {
  storyId: string;
}

/**
 * `storyId`에 대한 좋아요 표시 여부를 조회하는 쿼리 훅입니다.
 * @returns suspenseQuery 결과
 */
export default function useFavoriteQuery({ storyId }: UseFavoriteQueryParams) {
  const { user } = useUserStore();

  return useSuspenseQuery({
    queryKey: ["favorite", storyId, user?.uid],
    queryFn: async () => getFavorite({ storyId }),
    staleTime: Infinity,
  });
}
