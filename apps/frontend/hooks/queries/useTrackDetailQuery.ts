import { useSuspenseQuery } from "@tanstack/react-query";

import getTrackDetail from "@/apis/getTrackDetail";
import { useSettingStore } from "@/contexts/useSettingStore";

/**
 * @description 곡의 상세 정보를 가져오는 suspenseQuery 훅입니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useTrackDetailQuery(trackId: string, providerId: string) {
  const { setting } = useSettingStore();

  // 쿼리 반환
  return useSuspenseQuery({
    queryKey: ["detail", trackId],
    staleTime: Infinity,
    queryFn: async () => {
      const trackDetailDoc = await getTrackDetail({
        trackId,
        providerId,
        language: setting.defaultLanguage,
      });
      return trackDetailDoc;
    },
  });
}
