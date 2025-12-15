import { useMutation } from "@tanstack/react-query";

import { useUserStore } from "@/entities/auth/model/userStore";

import deleteFavorite from "../apis/deleteFavorite";
import { useFavoriteStore } from "../models/favoriteStore";

interface UseDeleteFavoriteMutationProps {
  storyId: string;
  trackId: string;
}

/**
 * `storyId`와 `trackId`에 대해 좋아요 삭제를 수행하는 뮤테이션 훅입니다.
 * @returns mutation 객체
 */
export default function useDeleteFavoriteMutation({
  storyId,
  trackId,
}: UseDeleteFavoriteMutationProps) {
  const { favoriteDeltaMap, add, setFavoriteDeltaMap } = useFavoriteStore();
  const { user } = useUserStore();

  return useMutation({
    mutationKey: ["delete-favorite", { storyId, trackId }, user?.uid],
    mutationFn: async () => await deleteFavorite({ storyId, trackId }),
    onMutate: async (_variables, context) => {
      // favorite 낙관적 업데이트
      const favoriteQueryKey = ["favorite", storyId, user?.uid];
      const favoritePreviousData = context.client.getQueryData<boolean>(favoriteQueryKey);

      context.client.cancelQueries({ queryKey: favoriteQueryKey });
      context.client.setQueryData<boolean>(favoriteQueryKey, false);

      // favoriteDeltaMap 낙관적 업데이트
      const favoriteDeltaPreviousData = favoriteDeltaMap;
      add(storyId, -1);

      // 원래 데이터 반환
      return { favoritePreviousData, favoriteDeltaPreviousData };
    },
    onError(_error, _variables, onMutateResult, context) {
      if (!onMutateResult) return;

      // favorite 낙관적 업데이트 롤백
      const favoriteQueryKey = ["favorite", storyId, user?.uid];
      context.client.setQueryData<boolean>(favoriteQueryKey, onMutateResult.favoritePreviousData);

      // favoriteDeltaMap 낙관적 업데이트 롤백
      setFavoriteDeltaMap(onMutateResult.favoriteDeltaPreviousData);

      // TODO: 에러 표시
    },
  });
}
