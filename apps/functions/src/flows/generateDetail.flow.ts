import { ProviderDoc, TrackDetailDoc } from "@lymo/schemas/doc";
import {
  GenerateDetailFlowInputSchema,
  GenerateDetailFlowOutputSchema,
  GenerateDetailFlowStreamSchema,
} from "@lymo/schemas/function";
import { LLMModel, Lyrics } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { logger } from "genkit/logging";

import ai from "@/core/genkit";
import getTrackDetailFromDB from "@/helpers/generateDetail/getTrackDetailFromDB";
import getLyricsFromDB from "@/helpers/shared/getLyricsFromDB";
import getProviderNameFromLLMModel from "@/helpers/shared/getProviderNameFromLLMModel";
import getTrackFromDB from "@/helpers/shared/getTrackFromDB";

import { groupLyricsFlow } from "./groupLyrics.flow";
import { summarizeParagraphFlow } from "./summarizeParagraph.flow";
import { summarizeSongFlow } from "./summarizeSong.flow";
import { translateLyricsFlow } from "./translateLyrics.flow";

/**
 * @description 트랙 상세 정보를 생성하는 플로우
 */
export const generateDetailFlow = ai.defineFlow(
  {
    name: "generateDetailFlow",
    inputSchema: GenerateDetailFlowInputSchema,
    streamSchema: GenerateDetailFlowStreamSchema,
    outputSchema: GenerateDetailFlowOutputSchema,
  },
  async (input, sendChunk) => {
    try {
      // 1) 중복 확인
      const llmModel: LLMModel = input.model ?? "gemini-2.5-flash-lite";
      const providerName = getProviderNameFromLLMModel(llmModel);
      const existingDetailDoc = await getTrackDetailFromDB({
        trackId: input.id,
        language: input.language,
        providerId: llmModel,
      });
      if (existingDetailDoc) {
        sendChunk({ event: "complete", data: null });
        return { success: true as const, exists: true as const, providerId: llmModel };
      }

      // 2) 곡 및 가사 문서 확인
      const [track, rawLyrics] = [
        await getTrackFromDB(input.id),
        await getLyricsFromDB(input.id, input.lyricsProvider),
      ];
      if (!track || !rawLyrics) {
        sendChunk({ event: "complete", data: null });
        return { success: false as const, exists: false as const };
      }

      sendChunk({
        event: "lyrics_provider_set",
        data: { lyricsProvider: rawLyrics.provider },
      });

      // 3) 데이터 준비
      const baseData = {
        title: track.title,
        artist: track.artist.join(", "),
        album: track.album,
        language: input.language,
      };

      // 4) 가사 번역 생성 및 스트림
      const { stream: translateLyricsStream, output: translateLyricsOutput } =
        translateLyricsFlow.stream({ ...baseData, lyrics: rawLyrics.lyrics });
      for await (const chunk of translateLyricsStream) {
        sendChunk(chunk);
      }
      const translations = await translateLyricsOutput;

      // 4) 문단 나누기
      const breaks = await groupLyricsFlow({
        lyrics: rawLyrics.lyrics,
      });
      sendChunk({ event: "lyrics_group", data: breaks });

      // 5) 문단별 가사 구조 생성
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

      // 6) 곡 요약 생성
      const { stream: summarizeSongStream, output: summarizeSongOutput } = summarizeSongFlow.stream(
        {
          ...baseData,
          lyrics: rawLyrics.lyrics.map((sentence) => sentence.text),
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

      // 7) 최종 결과 가져오기
      const [summary, paragraphSummaries] = await Promise.all([
        summarizeSongOutput,
        summarizeParagraphOutput,
      ]);

      // 10) 최종 결과 DB에 저장하기
      const providerDocRef = admin
        .firestore()
        .collection("tracks")
        .doc(input.id)
        .collection("providers")
        .doc(llmModel) as DocumentReference<ProviderDoc>;
      const trackDetailDocRef = providerDocRef
        .collection("details")
        .doc(input.language) as DocumentReference<TrackDetailDoc>;

      const date = new Date().toISOString();

      admin.firestore().runTransaction(async (transaction) => {
        // 11-1) 제공자 문서 생성
        transaction.set(providerDocRef, {
          createdAt: date,
          updatedAt: date,
          providerName,
        });

        // 11-2) 트랙 상세 정보 저장
        transaction.set(trackDetailDocRef, {
          summary,
          lyricsSplitIndices: breaks,
          lyricsProvider: rawLyrics.provider,
          translations,
          paragraphSummaries,
        });
      });

      sendChunk({
        event: "provider_set",
        data: { createdAt: date, updatedAt: date, providerName, providerId: llmModel },
      });

      sendChunk({ event: "complete", data: null });

      // 12) 최종 결과 반환
      return { success: true as const, exists: false as const };
    } catch (error) {
      logger.error("An error occurred in generateDetailFlow", error);
      sendChunk({ event: "complete", data: null });
      return { success: false as const, exists: false as const };
    }
  }
);
