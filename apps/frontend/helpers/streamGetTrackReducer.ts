import { CommonGetTrackFlowStream } from "@lymo/schemas/function";

import { StreamingFullTrack } from "@/types/shared";

/**
 * @description 곡 정보를 스트리밍 방식으로 받아올 때 사용하는 reducer 함수입니다.
 * @param acc 누적된 곡 정보
 * @param chunk 스트림으로 받아온 데이터 청크
 * @returns 업데이트된 곡 정보
 */
export default function streamGetTrackReducer(
  acc: StreamingFullTrack,
  chunk: CommonGetTrackFlowStream
) {
  const result = structuredClone(acc);
  console.log(chunk.event);

  switch (chunk.event) {
    case "update_track":
      result.track = chunk.data.track;
      result.trackId = chunk.data.trackId;
      break;

    case "update_lyrics":
      result.lyrics = { lyrics: chunk.data.lyrics };
      result.lyricsProvider = chunk.data.lyricsProvider;
      break;

    case "update_provider":
      result.provider = chunk.data.provider;
      result.providerId = chunk.data.providerId;
      break;

    case "update_track_detail":
      result.trackDetail = chunk.data;
      break;

    case "append_summary":
      if (result.trackDetail.summary === undefined) result.trackDetail.summary = chunk.data.summary;
      else result.trackDetail.summary += chunk.data.summary;
      break;

    case "update_lyrics_split_indices":
      result.trackDetail.lyricsSplitIndices = chunk.data.lyricsSplitIndices;
      break;

    case "update_translation":
      result.trackDetail.translations[chunk.data.sentenceIndex] = chunk.data.translation;
      break;

    case "append_paragraph_summary": {
      const index = chunk.data.paragraphIndex;
      if (result.trackDetail.paragraphSummaries[index] === undefined)
        result.trackDetail.paragraphSummaries[index] = chunk.data.paragraphSummary;
      else result.trackDetail.paragraphSummaries[index] += chunk.data.paragraphSummary;
      break;
    }

    case "update_paragraph_summary":
      result.trackDetail.paragraphSummaries[chunk.data.paragraphIndex] =
        chunk.data.paragraphSummary;
      break;
  }

  return result;
}
