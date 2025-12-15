import { useMutation } from "@tanstack/react-query";

import { useUserStore } from "@/entities/auth/model/userStore";

import createFavorite from "../apis/createFavorite";

interface UseCreateFavoriteMutationProps {
  storyId: string;
  trackId: string;
}

/**
 * `storyId`와 `trackId`에 대해 좋아요 생성을 수행하는 뮤테이션 훅입니다.
 * @returns mutation 객체
 */
export default function useCreateFavoriteMutation({
  storyId,
  trackId,
}: UseCreateFavoriteMutationProps) {
  const { user } = useUserStore();

  return useMutation({
    mutationKey: ["create-favorite", { storyId, trackId }, user?.uid],
    mutationFn: async () => await createFavorite({ storyId, trackId }),
    onMutate: async (_variables, context) => {
      // 원래 데이터 저장
      const favoriteQueryKey = ["favorite", storyId, user?.uid];
      const previousData = context.client.getQueryData<boolean>(favoriteQueryKey);

      // 낙관적 업데이트
      context.client.cancelQueries({ queryKey: favoriteQueryKey });
      context.client.setQueryData<boolean>(favoriteQueryKey, true);

      // 원래 데이터 반환
      return previousData;
    },
    onError(_error, _variables, onMutateResult, context) {
      // 낙관적 업데이트 롤백
      const favoriteQueryKey = ["favorite", storyId, user?.uid];
      context.client.setQueryData<boolean>(favoriteQueryKey, onMutateResult);

      // TODO: 에러 표시
    },
  });
}
