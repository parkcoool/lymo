import { useSuspenseQuery } from "@tanstack/react-query";

import getProviders from "@/apis/getProvider";

interface UseProvidersQueryProps {
  trackId: string;
}

/**
 * @description 곡의 제공자 목록을 가져오는 suspenseQuery 훅입니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useProvidersQuery({ trackId }: UseProvidersQueryProps) {
  return useSuspenseQuery({
    queryKey: ["providers", trackId],
    queryFn: async () => {
      console.log("useProvidersQuery called");
      const providers = await getProviders({ trackId });
      return providers;
    },
  });
}
