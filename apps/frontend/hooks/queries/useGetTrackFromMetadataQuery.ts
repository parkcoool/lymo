import { GetTrackFromMetadataFlowInput } from "@lymo/schemas/function";
import { useMemo } from "react";

import getTrackFromMetadata from "@/apis/getTrackFromMetadata";

import useGetTrackQuery from "./useGetTrackQuery";

/**
 * @description getTrackFromMetadata API를 사용하여 곡 정보를 가져오는 쿼리 훅입니다.
 *
 * 곡 정보에는 곡 정보, 가사 정보, 제공자 정보, 곡 상세 정보가 포함됩니다.
 *
 * @param trackId 곡 ID
 * @returns query 결과
 */
export default function useGetTrackFromMetadataQuery({
  title,
  artist,
  durationInSeconds,
}: GetTrackFromMetadataFlowInput["trackMetadata"]) {
  const queryKey = useMemo(
    () => ({ trackMetadata: { title, artist, durationInSeconds } }),
    [title, artist, durationInSeconds]
  );

  return useGetTrackQuery({
    queryKey,
    getFlow: getTrackFromMetadata,
  });
}
