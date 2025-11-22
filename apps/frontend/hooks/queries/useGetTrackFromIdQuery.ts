import { useMemo } from "react";

import getTrackFromId from "@/apis/getTrackFromId";

import useGetTrackQuery from "./useGetTrackQuery";

/**
 * @description getTrackFromId API를 사용하여 곡 정보를 가져오는 쿼리 훅입니다.
 *
 * 곡 정보에는 곡 정보, 가사 정보, 제공자 정보, 곡 상세 정보가 포함됩니다.
 *
 * @param trackId 곡 ID
 * @returns query 결과
 */
export default function useGetTrackFromIdQuery(trackId: string) {
  const queryKey = useMemo(() => ({ trackId }), [trackId]);

  return useGetTrackQuery({
    queryKey,
    getFlow: getTrackFromId,
  });
}
