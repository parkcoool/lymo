import { ProviderDoc, TrackDetailDoc } from "@lymo/schemas/doc";
import { Lyrics, LyricsProvider } from "@lymo/schemas/shared";
import {
  experimental_streamedQuery as streamedQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import generateDetail from "@/apis/generateDetail";
import { useSettingStore } from "@/contexts/useSettingStore";

export interface GenerateDetailResult {
  provider?: ProviderDoc;
  providerId?: string;
  trackDetail: Omit<TrackDetailDoc, "lyricsProvider"> & { lyricsProvider?: LyricsProvider };
  lyrics: Lyrics;
}

/**
 * @description 곡 정보를 생성하는 스트리밍 suspenseQuery 훅입니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useGenerateDetailQuery(trackId: string, lyricsProvider?: LyricsProvider) {
  const { setting } = useSettingStore();

  const key = {
    id: trackId,
    language: setting.defaultLanguage,
    lyricsProvider,
    model: setting.defaultLLMModel,
  };

  return useSuspenseQuery({
    queryKey: ["track-stream", key],

    queryFn: streamedQuery({
      streamFn: async function* () {
        const flow = generateDetail(key);

        for await (const chunk of flow.stream) {
          yield chunk;
        }
      },

      reducer: (acc, chunk) => {
        const result = structuredClone(acc);
        console.log(chunk);

        switch (chunk.event) {
          case "lyrics_provider_set":
            result.trackDetail.lyricsProvider = chunk.data.lyricsProvider;
            break;

          case "translation_set":
            result.trackDetail.translations[chunk.data.sentenceIndex] = chunk.data.text;
            break;

          case "lyrics_group":
            result.trackDetail.lyricsSplitIndices = chunk.data;
            break;

          case "summary_append":
            result.trackDetail.summary += chunk.data.summary;
            break;

          case "paragraph_summary_append":
            result.trackDetail.paragraphSummaries[chunk.data.paragraphIndex] = chunk.data.summary;
            break;

          case "provider_set": {
            const { providerId, ...provider } = chunk.data;
            result.provider = provider;
            result.providerId = providerId;
            break;
          }
        }

        return result;
      },

      initialValue: {
        trackDetail: {
          summary: "",
          lyricsSplitIndices: [],
          translations: [],
          paragraphSummaries: [],
        },
        lyrics: [],
      } as GenerateDetailResult,
    }),
  });
}
