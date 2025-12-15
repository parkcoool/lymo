import { Story } from "@lymo/schemas/doc";
import { useMutation } from "@tanstack/react-query";

import { useUserStore } from "@/entities/auth/model/userStore";
import { useSettingStore } from "@/entities/setting/models/settingStore";

import deleteFavorite from "../apis/deleteFavorite";

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
  const { setting } = useSettingStore();
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

      // story 낙관적 업데이트
      const storyQueryKey = ["story", trackId, setting.language];
      const storyPreviousData = context.client.getQueryData<{ id: string; data: Story } | null>(
        storyQueryKey
      );

      context.client.cancelQueries({ queryKey: storyQueryKey });
      context.client.setQueryData<{ id: string; data: Story } | null>(storyQueryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            stats: {
              ...oldData.data.stats,
              favoriteCount: oldData.data.stats.favoriteCount - 1,
            },
          },
        };
      });

      // 원래 데이터 반환
      return { favoritePreviousData, storyPreviousData };
    },
    onError(_error, _variables, onMutateResult, context) {
      if (!onMutateResult) return;

      // favorite 낙관적 업데이트 롤백
      const favoriteQueryKey = ["favorite", storyId, user?.uid];
      context.client.setQueryData<boolean>(favoriteQueryKey, onMutateResult.favoritePreviousData);

      // story 낙관적 업데이트 롤백
      const storyQueryKey = ["story", trackId, setting.language];
      context.client.setQueryData<{ id: string; data: Story } | null>(
        storyQueryKey,
        onMutateResult.storyPreviousData
      );

      // TODO: 에러 표시
    },
  });
}
