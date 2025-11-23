import { errorCode } from "@lymo/schemas/error";
import {
  GetTrackFromIdFlowInputSchema,
  GetTrackFromIdFlowOutputSchema,
  GetTrackFromIdFlowStreamSchema,
} from "@lymo/schemas/function";
import { logger } from "genkit/logging";

import ai from "@/core/genkit";
import getTrackFromDB from "@/helpers/getTrackFromDB";
import getTrackFromTrack from "@/helpers/getTrackFromTrack";

/**
 * @description 트랙 ID를 받아 관련 정보를 가져오거나 생성하여 DB에 저장한 뒤 반환하는 플로우
 *
 * DB에 이미 존재하는 트랙인 경우, 기존 데이터를 반환합니다.
 */
export const getTrackFromIdFlow = ai.defineFlow(
  {
    name: "getTrackFromIdFlow",
    inputSchema: GetTrackFromIdFlowInputSchema,
    streamSchema: GetTrackFromIdFlowStreamSchema,
    outputSchema: GetTrackFromIdFlowOutputSchema,
  },
  async ({ trackId, language, model }, { sendChunk }) => {
    try {
      // 1) track 문서 가져오기
      const trackDoc = await getTrackFromDB({ trackId });

      // 1-1) track 문서가 존재하지 않는 경우
      if (!trackDoc)
        return {
          success: false,
          message: "곡 정보를 찾을 수 없습니다.",
          errorCode: errorCode.enum.TRACK_NOT_FOUND,
        };

      // 1-2) track 문서 스트리밍
      sendChunk({ event: "update_track", data: { track: trackDoc, trackId } });

      // 2) provider, trackDetail, lyrics 문서 가져오기 및 스트리밍 처리
      const stream = getTrackFromTrack({
        track: { trackDoc, trackId },
        config: { language, model },
      });

      let chunk;
      while (!(chunk = await stream.next()).done) sendChunk(chunk.value);
      return chunk.value;
    } catch (error) {
      logger.error("An error occurred in getTrackFromIdFlow", error);
      return { success: false, message: "서버에서 오류가 발생했습니다." };
    }
  }
);
