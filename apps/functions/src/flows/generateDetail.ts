import { randomUUID } from "crypto";

import { TrackDetailDoc } from "@lymo/schemas/doc";
import {
  GenerateDetailFlowInputSchema,
  GenerateDetailFlowOutputSchema,
  GenerateDetailFlowStreamSchema,
} from "@lymo/schemas/function";
import { LLMModel, Lyrics } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { HttpsError } from "firebase-functions/https";

import ai from "@/core/genkit";
import getTrackDetailFromDB from "@/helpers/generateDetail/getTrackDetailFromDB";
import getProviderIdFromLLMModel from "@/helpers/shared/getAIModelName";
import getLyricsFromDB from "@/helpers/shared/getLyricsFromDB";
import getTrackFromDB from "@/helpers/shared/getTrackFromDB";
import { groupLyrics } from "@/tools/groupLyrics";

import { summarizeParagraphFlow } from "./summarizeParagraph.flow";
import { summarizeSongFlow } from "./summarizeSong.flow";
import { translateLyricsFlow } from "./translateLyrics.flow";

/**
 * @description 트랙 상세 정보를 생성하는 플로우
 */
export const generateDetail = ai.defineFlow(
  {
    name: "generateDetailFlow",
    inputSchema: GenerateDetailFlowInputSchema,
    streamSchema: GenerateDetailFlowStreamSchema,
    outputSchema: GenerateDetailFlowOutputSchema,
  },
  async (input, sendChunk) => {
    try {
      // 1) 중복 확인
      const llmModel: LLMModel = input.model ?? "googleai/gemini-2.5-flash-lite";
      const providerId = getProviderIdFromLLMModel(llmModel);
      const existingDetailDoc = await getTrackDetailFromDB({
        trackId: input.id,
        language: input.language,
        providerId,
      });
      if (existingDetailDoc) return { success: true as const, providerId };

      // 2) 곡 및 가사 문서 확인
      const track = await getTrackFromDB(input.id);
      if (!track) return { success: false as const };
      const rawLyrics = await getLyricsFromDB(input.id, input.lyricsProvider);
      if (!rawLyrics) return { success: false as const };

      // 3) 문단 나누기
      const breaks = await groupLyrics({ lyrics: rawLyrics.lyrics });

      // 4) 생성을 위한 데이터 준비
      const baseData = {
        title: track.title,
        artist: track.artist.join(", "),
        album: track.album,
        language: input.language,
      };

      // 4-1) 문단별 가사 구조 생성
      const lyrics: Lyrics = [];
      let lastBreak = -1;
      for (const breakIndex of breaks) {
        lyrics.push({
          sentences: rawLyrics.lyrics
            .slice(lastBreak + 1, breakIndex + 1)
            .map((s) => ({ ...s, translation: null })),
          summary: null,
        });
        lastBreak = breakIndex;
      }
      lyrics.push({
        sentences: rawLyrics.lyrics.slice(lastBreak + 1).map((s) => ({ ...s, translation: null })),
        summary: "",
      });

      // 5-1) 곡 요약 생성
      const { stream: summarizeSongStream, output: summarizeSongOutput } = summarizeSongFlow.stream(
        { ...baseData, lyrics: rawLyrics.lyrics.map((sentence) => sentence.text) }
      );

      // 5-2) 가사 번역 생성
      const { stream: translateLyricsStream, output: translateLyricsOutput } =
        translateLyricsFlow.stream({ ...baseData, lyrics: rawLyrics.lyrics });

      // 5-3) 문단 요약 생성
      const { stream: summarizeParagraphStream, output: summarizeParagraphOutput } =
        summarizeParagraphFlow.stream({
          ...baseData,
          lyrics: lyrics.map((paragraph) => paragraph.sentences.map((sentence) => sentence.text)),
        });

      // 6) 스트림 처리
      await Promise.all(
        [summarizeSongStream, translateLyricsStream, summarizeParagraphStream].map((stream) =>
          (async () => {
            for await (const chunk of stream) {
              sendChunk(chunk);
            }
          })()
        )
      );

      // 7) 최종 결과 가져오기
      const [summary, translations, paragraphSummaries] = await Promise.all([
        summarizeSongOutput,
        translateLyricsOutput,
        summarizeParagraphOutput,
      ]);

      // 8) 최종 결과 DB에 저장하기
      const trackDetailDocRef = admin
        .firestore()
        .collection("tracks")
        .doc(input.id)
        .collection("details")
        .doc(providerId)
        .collection("contents")
        .doc(input.language) as DocumentReference<TrackDetailDoc>;
      await trackDetailDocRef.set({
        summary,
        lyricsSplitIndices: breaks,
        lyricsProvider: rawLyrics.provider,
        translations,
        paragraphSummaries,
      });

      // 9) 최종 결과 반환
      return { success: true as const, providerId };
    } catch (error) {
      if (error instanceof Error) {
        const errorId = randomUUID();
        logger.error("addTrackFlow: error occurred.", { ...error, errorId });
        throw new HttpsError("internal", "서버에서 오류가 발생했습니다.", { errorId });
      }

      return { success: false as const };
    }
  }
);
