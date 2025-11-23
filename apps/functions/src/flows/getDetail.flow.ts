import { ProviderDoc, TrackDetailDoc } from "@lymo/schemas/doc";
import { Lyrics } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { logger } from "genkit/logging";

import ai from "@/core/genkit";
import getProviderNameFromLLMModel from "@/helpers/getProviderNameFromLLMModel";
import getTrackDetailFromDB from "@/helpers/getTrackDetailFromDB";

import {
  GetDetailFlowInputSchema,
  GetDetailFlowOutputSchema,
  GetDetailFlowStreamSchema,
} from "./getDetail.schemas";
import { groupLyricsFlow } from "./groupLyrics.flow";
import { summarizeParagraphFlow } from "./summarizeParagraph.flow";
import { summarizeSongFlow } from "./summarizeSong.flow";
import { translateLyricsFlow } from "./translateLyrics.flow";

/**
 * @description 트랙 상세 정보를 가져오거나 생성하는 플로우
 */
export const getDetailFlow = ai.defineFlow(
  {
    name: "getDetailFlow",
    inputSchema: GetDetailFlowInputSchema,
    streamSchema: GetDetailFlowStreamSchema,
    outputSchema: GetDetailFlowOutputSchema,
  },
  async (input, { sendChunk }) => {
    try {
      // 1) 상세 정보가 이미 있으면 반환
      const existingDetailDoc = await getTrackDetailFromDB({
        trackId: input.trackId,
        language: input.language,
        providerId: input.model,
      });
      if (existingDetailDoc) return existingDetailDoc;

      // 2) 데이터 준비
      const baseData = {
        title: input.metadata.title,
        artist: input.metadata.artist,
        album: input.metadata.album,
        language: input.language,
      };

      // 3) 가사 번역 생성 및 스트림
      const { stream: translateLyricsStream, output: translateLyricsOutput } =
        translateLyricsFlow.stream({ ...baseData, lyrics: input.lyrics });
      for await (const chunk of translateLyricsStream) {
        sendChunk(chunk);
      }
      const translations = await translateLyricsOutput;

      // 4) 문단 나누기
      const breaks = await groupLyricsFlow({
        lyrics: input.lyrics,
      });
      sendChunk({ event: "lyrics_group", data: breaks });

      // 5) 문단별 가사 구조 생성
      const lyrics: Lyrics = [];
      let lastBreak = -1;
      for (const breakIndex of breaks) {
        lyrics.push({
          sentences: input.lyrics
            .slice(lastBreak + 1, breakIndex + 1)
            .map((s) => ({ ...s, translation: null })),
          summary: null,
        });
        lastBreak = breakIndex;
      }
      lyrics.push({
        sentences: input.lyrics.slice(lastBreak + 1).map((s) => ({ ...s, translation: null })),
        summary: "",
      });

      // 6) 곡 요약 생성
      const { stream: summarizeSongStream, output: summarizeSongOutput } = summarizeSongFlow.stream(
        {
          ...baseData,
          lyrics: input.lyrics.map((sentence) => sentence.text),
        }
      );

      // 7) 문단 요약 생성
      const { stream: summarizeParagraphStream, output: summarizeParagraphOutput } =
        summarizeParagraphFlow.stream({
          ...baseData,
          lyrics: lyrics.map((paragraph) => paragraph.sentences.map((sentence) => sentence.text)),
        });

      // 8) 스트림 처리
      await Promise.all(
        [summarizeSongStream, summarizeParagraphStream].map((stream) =>
          (async () => {
            for await (const chunk of stream) {
              sendChunk(chunk);
            }
          })()
        )
      );

      // 9) 최종 결과 가져오기
      const [summary, paragraphSummaries] = await Promise.all([
        summarizeSongOutput,
        summarizeParagraphOutput,
      ]);

      // 10) 상세 정보 문서 데이터 준비
      const detailDoc: TrackDetailDoc = {
        summary,
        lyricsSplitIndices: breaks,
        lyricsProvider: input.lyricsProvider,
        translations,
        paragraphSummaries,
      };

      // 11) 제공자 스트리밍
      const date = new Date().toISOString();
      const providerName = getProviderNameFromLLMModel(input.model);
      sendChunk({
        event: "provider_set",
        data: {
          createdAt: date,
          updatedAt: date,
          providerName,
          providerId: input.model,
        },
      });

      // 12) DB에 저장
      const providerDocRef = admin
        .firestore()
        .collection("tracks")
        .doc(input.trackId)
        .collection("providers")
        .doc(input.model) as DocumentReference<ProviderDoc>;
      const trackDetailDocRef = providerDocRef
        .collection("details")
        .doc(input.language) as DocumentReference<TrackDetailDoc>;

      admin.firestore().runTransaction(async (transaction) => {
        // 12-1) 제공자 문서 생성
        transaction.set(providerDocRef, {
          createdAt: date,
          updatedAt: date,
          providerName,
        });

        // 12-2) 트랙 상세 정보 저장
        transaction.set(trackDetailDocRef, detailDoc);
      });

      sendChunk({ event: "complete", data: null });

      // 13) 최종 결과 반환
      return detailDoc;
    } catch (error) {
      logger.error("An error occurred in getDetailFlow", error);
      throw error;
    }
  }
);
