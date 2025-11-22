import {
  CommonGetTrackFlowStream,
  GetTrackFlowResult,
  GetTrackFromIdFlowInput,
  GetTrackFromMetadataFlowInput,
} from "@lymo/schemas/function";
import {
  experimental_streamedQuery as streamedQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { useSettingStore } from "@/contexts/useSettingStore";
import streamGetTrackReducer from "@/helpers/streamGetTrackReducer";

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

type FlowOutput = {
  readonly output: Promise<
    | (GetTrackFlowResult & { stream: false })
    | (Partial<GetTrackFlowResult> & { stream: true })
    | null
  >;
  readonly stream: AsyncIterable<CommonGetTrackFlowStream>;
};

interface UseGetTrackQueryOptions<
  TQueryKey extends Record<string, unknown>,
  TFlowInput extends GetTrackFromIdFlowInput | GetTrackFromMetadataFlowInput
> {
  queryKey: TQueryKey;
  getFlow: (key: TFlowInput) => FlowOutput;
}

/**
 * @description getTrack API를 사용하여 곡 정보를 가져오는 공통 쿼리 훅입니다.
 *
 * 곡 정보에는 곡 정보, 가사 정보, 제공자 정보, 곡 상세 정보가 포함됩니다.
 */
export default function useGetTrackQuery<
  TQueryKey extends Record<string, unknown>,
  TFlowInput extends GetTrackFromIdFlowInput | GetTrackFromMetadataFlowInput
>({ queryKey, getFlow }: UseGetTrackQueryOptions<TQueryKey, TFlowInput>) {
  const { setting } = useSettingStore();

  const key = useMemo(
    () => ({
      ...queryKey,
      language: setting.defaultLanguage,
      model: setting.defaultLLMModel,
    }),
    [queryKey, setting.defaultLanguage, setting.defaultLLMModel]
  ) as TQueryKey & TFlowInput;

  const query = useSuspenseQuery<GetTrackFlowResult>({
    queryKey: ["get-track", key],

    queryFn: streamedQuery({
      streamFn: async function* (context) {
        const flow = getFlow(key);

        // 스트림 및 최종 결과 처리
        for await (const chunk of flow.stream) yield chunk;
        const output = await flow.output;

        // 곡 정보를 가져올 수 없는 경우 에러 처리
        if (!output) throw new Error("곡 정보를 가져올 수 없습니다.");

        // 스트리밍이 아니면 반환된 결과를 캐시에 저장
        if ("stream" in output && !output.stream) {
          const { stream, ...result } = output;
          context.client.setQueryData<GetTrackFlowResult>(["get-track", key], result);
        }
      },

      reducer: streamGetTrackReducer,

      initialValue,
    }),

    staleTime: Infinity,
    retry: false,
  });

  // 스트리밍 도중 컴포넌트가 언마운트되면 부분적으로 쌓인 데이터를 무효화
  const queryClient = useQueryClient();
  useEffect(() => {
    return () => {
      if (!query.isSuccess) {
        queryClient.removeQueries({ queryKey: ["get-track", key] });
      }
    };
  }, [query.isSuccess, queryClient, key]);

  return query;
}
