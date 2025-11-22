import {
  GetTrackFromMetadataFlowInputSchema,
  GetTrackFromMetadataFlowOutputSchema,
  GetTrackFromMetadataFlowStreamSchema,
} from "@lymo/schemas/function";
import { logger } from "genkit/logging";

import ai from "@/core/genkit";
import { searchSpotify } from "@/tools/searchSpotify";

import { getTrackFromIdFlow } from "./getTrackFromId.flow";

/**
 * @description 트랙 메타데이터를 받아 관련 정보를 가져오거나 생성하여 DB에 저장한 뒤 반환하는 플로우
 *
 * DB에 이미 존재하는 트랙인 경우, 기존 데이터를 반환합니다.
 */
export const getTrackFromMetadataFlow = ai.defineFlow(
  {
    name: "getTrackFromMetadataFlow",
    inputSchema: GetTrackFromMetadataFlowInputSchema,
    streamSchema: GetTrackFromMetadataFlowStreamSchema,
    outputSchema: GetTrackFromMetadataFlowOutputSchema,
  },
  async (input, { sendChunk }) => {
    try {
      // 1) Spotify에서 곡 검색
      const spotifyResult = await searchSpotify({
        title: input.trackMetadata.title,
        artist: input.trackMetadata.artist,
        duration: input.trackMetadata.durationInSeconds,
      });

      // 1-1) 곡을 찾지 못한 경우 null 반환
      if (!spotifyResult) return null;

      // 2) getTrackFromIdFlow 호출
      const { output, stream } = getTrackFromIdFlow.stream({
        trackId: spotifyResult.id,
        language: input.language,
        model: input.model,
      });

      // 2-1) 스트림 처리
      for await (const chunk of stream) {
        sendChunk(chunk);
      }

      // 2-2) 최종 결과 반환
      return await output;
    } catch (error) {
      logger.error("An error occurred in getTrackFromMetadataFlow", error);
      return null;
    }
  }
);
