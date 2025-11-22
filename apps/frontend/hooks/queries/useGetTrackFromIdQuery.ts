import { GetTrackFlowResult } from "@lymo/schemas/function";
import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import getTrackFromId from "@/apis/getTrackFromId";
import { useSettingStore } from "@/contexts/useSettingStore";
import streamGetTrackReducer from "@/helpers/streamGetTrackReducer";

/**
 * @description getTrackFromId API를 사용하여 곡 정보를 가져오는 쿼리 훅입니다.
 *
 * 곡 정보에는 곡 정보, 가사 정보, 제공자 정보, 곡 상세 정보가 포함됩니다.
 *
 * @param trackId 곡 ID
 * @returns query 결과
 */
export default function useGetTrackFromIdQuery(trackId: string) {
  const { setting } = useSettingStore();

  const key = useMemo(
    () => ({
      trackId,
      language: setting.defaultLanguage,
      model: setting.defaultLLMModel,
    }),
    [trackId, setting.defaultLanguage, setting.defaultLLMModel]
  );

  const query = useQuery<GetTrackFlowResult>({
    queryKey: ["get-track-from-id", key],

    queryFn: streamedQuery({
      streamFn: async function* (context) {
        const flow = getTrackFromId(key);

        // 스트림 및 최종 결과 처리
        for await (const chunk of flow.stream) yield chunk;
        const output = await flow.output;

        // 곡 정보를 가져올 수 없는 경우 에러 처리
        if (!output) throw new Error("곡 정보를 가져올 수 없습니다.");

        // 스트리밍이 아니면 반환된 결과를 캐시에 저장
        if (!output.stream) {
          const { stream, ...result } = output;
          context.client.setQueryData<GetTrackFlowResult>(["get-track-from-id", key], result);
        }
      },

      reducer: streamGetTrackReducer,

      initialValue,
    }),

    staleTime: Infinity,
    placeholderData: initialValue,
  });

  // 스트리밍 도중 컴포넌트가 언마운트되면 부분적으로 쌓인 데이터를 무효화
  const queryClient = useQueryClient();
  useEffect(() => {
    return () => {
      if (!query.isSuccess) {
        queryClient.removeQueries({ queryKey: ["get-track-from-id", key] });
      }
    };
  }, [query.isSuccess, queryClient, key]);

  return query;
}

const initialValue: GetTrackFlowResult = {
  detail: {
    summary: "",
    lyricsSplitIndices: [],
    lyricsProvider: "none",
    translations: [],
    paragraphSummaries: [],
  },
  providerId: "",
  provider: {
    createdAt: "",
    updatedAt: "",
    providerName: "",
  },
  lyricsProvider: "none",
  lyrics: { lyrics: [] },
  track: {
    album: null,
    artist: [],
    coverUrl: "",
    duration: 0,
    publishedAt: null,
    title: "",
    createdAt: "",
    play: 0,
  },
};
