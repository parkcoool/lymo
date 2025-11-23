import { TrackDoc } from "@lymo/schemas/doc";
import { errorCode } from "@lymo/schemas/error";
import {
  GetTrackFromMetadataFlowInputSchema,
  GetTrackFromMetadataFlowOutputSchema,
  GetTrackFromMetadataFlowStreamSchema,
} from "@lymo/schemas/function";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { logger } from "genkit/logging";

import ai from "@/core/genkit";
import getTrackFromTrack from "@/helpers/getTrackFromTrack";
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
  async ({ trackMetadata, language, model }, { sendChunk }) => {
    try {
      // 1) Spotify에서 곡 검색
      const spotifyResult = await searchSpotify({
        title: trackMetadata.title,
        artist: trackMetadata.artist,
        duration: trackMetadata.durationInSeconds,
      });

      // 1-1) 곡을 찾지 못한 경우 error 반환
      if (!spotifyResult)
        return {
          success: false,
          message: "곡을 찾을 수 없습니다.",
          errorCode: errorCode.enum.TRACK_SEARCH_NOT_FOUND,
        };
      const trackId = spotifyResult.id;

      // 2) getTrackFromIdFlow 호출
      {
        const { output, stream } = getTrackFromIdFlow.stream({ trackId, language, model });

        // 2-1) 스트림 처리 및 최종 결과 반환
        for await (const chunk of stream) sendChunk(chunk);
        const getTrackFromIdFlowOutput = await output;
        if (getTrackFromIdFlowOutput.errorCode !== errorCode.enum.TRACK_NOT_FOUND)
          return getTrackFromIdFlowOutput;
      }

      // 3) track 문서 생성
      {
        const trackDocRef = admin
          .firestore()
          .collection("tracks")
          .doc(spotifyResult.id) as DocumentReference<TrackDoc>;
        const trackDoc: TrackDoc = {
          title: spotifyResult.title,
          artists: spotifyResult.artists,
          album: spotifyResult.album,
          coverUrl: spotifyResult.coverUrl,
          duration: spotifyResult.duration,
          publishedAt: spotifyResult.publishedAt,
          createdAt: new Date().toISOString(),
          play: 0,
        };
        await trackDocRef.set(trackDoc);

        // 4) provider, trackDetail, lyrics 문서 가져오기 및 스트리밍 처리
        const stream = getTrackFromTrack({
          track: { trackDoc, trackId },
          config: { language, model },
        });

        let chunk;
        while (!(chunk = await stream.next()).done) sendChunk(chunk.value);
        return chunk.value;
      }
    } catch (error) {
      logger.error("An error occurred in getTrackFromMetadataFlow", error);
      return { success: false, message: "서버에서 오류가 발생했습니다." };
    }
  }
);
