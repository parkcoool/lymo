import { TrackDoc } from "@lymo/schemas/doc";
import {
  GetTrackFromMetadataFlowInputSchema,
  GetTrackFromMetadataFlowOutputSchema,
  GetTrackFromMetadataFlowStreamSchema,
} from "@lymo/schemas/function";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
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
      let { output, stream } = getTrackFromIdFlow.stream({
        trackId: spotifyResult.id,
        language: input.language,
        model: input.model,
      });

      // 2-1) 스트림 처리 및 최종 결과 반환
      for await (const chunk of stream) sendChunk(chunk);
      let track = await output;
      if (track) return track;

      // 3) track 문서 생성
      const date = new Date().toISOString();
      const trackDocRef = admin
        .firestore()
        .collection("tracks")
        .doc(spotifyResult.id) as DocumentReference<TrackDoc>;
      const trackData: TrackDoc = {
        title: spotifyResult.title,
        artist: spotifyResult.artist,
        album: spotifyResult.album,
        coverUrl: spotifyResult.coverUrl,
        duration: spotifyResult.duration,
        publishedAt: spotifyResult.publishedAt,
        createdAt: date,
        play: 0,
      };
      await trackDocRef.set(trackData);

      // 4) 다시 getTrackFromIdFlow 호출
      ({ output, stream } = getTrackFromIdFlow.stream({
        trackId: spotifyResult.id,
        language: input.language,
        model: input.model,
      }));

      // 4-1) 스트림 처리 및 최종 결과 반환
      for await (const chunk of stream) sendChunk(chunk);
      track = await output;
      return track;
    } catch (error) {
      logger.error("An error occurred in getTrackFromMetadataFlow", error);
      return null;
    }
  }
);
