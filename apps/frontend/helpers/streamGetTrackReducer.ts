import { CommonGetTrackFlowStream, GetTrackFlowResult } from "@lymo/schemas/function";

/**
 * @description 곡 정보를 스트리밍 방식으로 받아올 때 사용하는 reducer 함수입니다.
 * @param acc 누적된 곡 정보
 * @param chunk 스트림으로 받아온 데이터 청크
 * @returns 업데이트된 곡 정보
 */
export default function streamGetTrackReducer(
  acc: GetTrackFlowResult,
  chunk: CommonGetTrackFlowStream
) {
  const result = structuredClone(acc);

  switch (chunk.event) {
    case "track_set":
      result.track = chunk.data;
      break;

    case "lyrics_set":
      result.lyrics.lyrics = chunk.data.lyrics;
      break;

    case "lyrics_provider_set":
      result.detail.lyricsProvider = chunk.data.lyricsProvider;
      break;

    case "translation_set": {
      result.detail.translations[chunk.data.sentenceIndex] = chunk.data.text;
      break;
    }

    case "lyrics_group":
      result.detail.lyricsSplitIndices = chunk.data;
      break;

    case "summary_append":
      result.detail.summary += chunk.data.summary;
      break;

    case "paragraph_summary_append": {
      const summary = result.detail.paragraphSummaries[chunk.data.paragraphIndex] || "";
      result.detail.paragraphSummaries[chunk.data.paragraphIndex] = summary + chunk.data.summary;
      break;
    }

    case "provider_set": {
      const { providerId, ...provider } = chunk.data;
      result.provider = provider;
      result.providerId = providerId;
      break;
    }
  }

  return result;
}
