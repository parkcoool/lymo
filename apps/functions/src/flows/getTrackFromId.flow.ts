import {
  GetTrackFromIdFlowInputSchema,
  GetTrackFromIdFlowOutputSchema,
  GetTrackFromIdFlowStreamSchema,
} from "@lymo/schemas/function";
import { logger } from "genkit/logging";

import ai from "@/core/genkit";
import getLyricsFromDB from "@/helpers/getLyricsFromDB";
import getProviderFromDB from "@/helpers/getProviderFromDB";
import getTrackDetailFromDB from "@/helpers/getTrackDetailFromDB";
import getTrackFromDB from "@/helpers/getTrackFromDB";
import { streamLyricsAndTrackDetail } from "@/helpers/streamLyricsAndTrackDetail";

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
  async (input, { sendChunk }) => {
    try {
      // 1) track 문서 가져오기
      const trackDoc = await getTrackFromDB({ trackId: input.trackId });

      // 1-1) track 문서가 존재하지 않는 경우 error 반환
      if (!trackDoc) throw new Error("Track not found");

      // 1-2) track 문서 스트리밍
      sendChunk({ event: "track_set", data: trackDoc });

      // 2) provider 문서 가져오기
      const providerDoc = await getProviderFromDB({ trackId: input.trackId, model: input.model });

      // 2-1) provider 문서가 존재하지 않는 경우 스트리밍 시작
      if (!providerDoc) {
        const stream = streamLyricsAndTrackDetail({
          trackId: input.trackId,
          metadata: {
            title: trackDoc.title,
            album: trackDoc.album,
            artists: trackDoc.artist,
            duration: trackDoc.duration,
          },
          language: input.language,
          model: input.model,
        });

        for await (const chunk of stream) sendChunk(chunk);
        return null;
      }

      // 3) trackDetail 문서 가져오기
      const trackDetailDoc = await getTrackDetailFromDB({
        trackId: input.trackId,
        language: input.language,
        providerId: providerDoc.id,
      });

      // 3-1) trackDetail 문서가 존재하지 않는 경우 스트리밍 시작
      if (!trackDetailDoc) {
        const stream = streamLyricsAndTrackDetail({
          trackId: input.trackId,
          metadata: {
            title: trackDoc.title,
            album: trackDoc.album,
            artists: trackDoc.artist,
            duration: trackDoc.duration,
          },
          language: input.language,
          model: input.model,
        });

        for await (const chunk of stream) sendChunk(chunk);
        return null;
      }

      // 4) lyrics 문서 가져오기
      const lyricsDoc = await getLyricsFromDB({
        trackId: input.trackId,
        lyricsProvider: trackDetailDoc.lyricsProvider,
      });

      // lyrics 문서가 존재하지 않는 경우 error 반환
      if (!lyricsDoc) throw new Error("Lyrics not found");

      return {
        detail: trackDetailDoc,
        providerId: providerDoc.id,
        provider: providerDoc.provider,
        lyricsProvider: trackDetailDoc.lyricsProvider,
        lyrics: lyricsDoc,
        track: trackDoc,
        stream: false,
      };
    } catch (error) {
      logger.error("An error occurred in getTrackFromIdFlow", error);
      return null;
    }
  }
);
