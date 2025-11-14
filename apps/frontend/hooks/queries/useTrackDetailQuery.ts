import { Language } from "@lymo/schemas/shared";
import { useSuspenseQuery } from "@tanstack/react-query";

import getTrackDetail from "@/apis/getTrackDetail";

interface UseTrackDetailQueryProps {
  trackId: string;
  providerId: string;
  language: Language;
}

/**
 * @description 곡의 상세 정보를 가져오는 suspenseQuery 훅입니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useTrackDetailQuery(props: UseTrackDetailQueryProps) {
  return useSuspenseQuery({
    queryKey: ["detail", props],
    queryFn: async () => {
      console.log("useTrackDetailQuery called");
      const trackDetailDoc = await getTrackDetail(props);
      return trackDetailDoc;
    },
  });
}
