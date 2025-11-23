import { ProviderDoc, TrackDetailDoc } from "@lymo/schemas/doc";
import { Lyrics } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { logger } from "genkit/logging";

import ai from "@/core/genkit";
import getProviderNameFromLLMModel from "@/helpers/getProviderNameFromLLMModel";

import {
  GenerateTrackDetailFlowInputSchema,
  GenerateTrackDetailFlowOutputSchema,
  GenerateTrackDetailFlowStreamSchema,
} from "./generateTrackDetail.schemas";
import { groupLyricsFlow } from "./groupLyrics.flow";
import { summarizeParagraphFlow } from "./summarizeParagraph.flow";
import { summarizeSongFlow } from "./summarizeSong.flow";
import { translateLyricsFlow } from "./translateLyrics.flow";

/**
 * @description 트랙 상세 정보를 생성하는 플로우
 */
export const generateTrackDetail = ai.defineFlow(
  {
    name: "generateTrackDetail",
    inputSchema: GenerateTrackDetailFlowInputSchema,
    streamSchema: GenerateTrackDetailFlowStreamSchema,
    outputSchema: GenerateTrackDetailFlowOutputSchema,
  },
  async (
    { track, lyrics: { lyricsProvider, lyrics: rawLyrics }, config: { language, model } },
    { sendChunk }
  ) => {
    try {
      // 1) 가사 번역 생성 및 스트림
      const { stream: translateLyricsStream, output: translateLyricsOutput } =
        translateLyricsFlow.stream({ track, lyrics: rawLyrics, config: { language } });
      for await (const chunk of translateLyricsStream) {
        sendChunk({
          event: "update_translation",
          data: chunk,
        });
      }
      const translations = await translateLyricsOutput;

      // 2) 문단 나누기
      const lyricsSplitIndices = await groupLyricsFlow({ lyrics: rawLyrics });
      sendChunk({ event: "update_lyrics_split_indices", data: { lyricsSplitIndices } });

      // 3) 가사 구조 생성
      const lyrics: Lyrics = [];
      let lastLyricsSplitIndex = -1;
      for (const lyricsSplitIndex of [...lyricsSplitIndices, rawLyrics.length - 1]) {
        lyrics.push({
          sentences: rawLyrics
            .slice(lastLyricsSplitIndex + 1, lyricsSplitIndex + 1)
            .map((s) => ({ ...s, translation: null })),
          summary: null,
        });
        lastLyricsSplitIndex = lyricsSplitIndex;
      }

      // 4) 곡 요약 생성
      const { stream: summarizeSongStream, output: summarizeSongOutput } = summarizeSongFlow.stream(
        {
          track,
          lyrics: rawLyrics.map((line) => line.text),
          config: { language },
        }
      );

      // 5) 문단 요약 생성
      const { stream: summarizeParagraphStream, output: summarizeParagraphOutput } =
        summarizeParagraphFlow.stream({
          track,
          lyrics: lyrics.map((paragraph) => paragraph.sentences.map((sentence) => sentence.text)),
          config: { language },
        });

      // 6) 최종 결과 대기 및 스트림 처리
      const [summary, paragraphSummaries, ,] = await Promise.all([
        // 6-1) 최종 결과 대기
        summarizeSongOutput,
        summarizeParagraphOutput,

        // 6-2) summarizeSongStream 처리
        (async () => {
          for await (const chunk of summarizeSongStream)
            sendChunk({ event: "append_summary", data: { summary: chunk } });
        })(),

        // 6-3) summarizeParagraphStream 처리
        (async () => {
          for await (const chunk of summarizeParagraphStream) sendChunk(chunk);
        })(),
      ]);

      // 7) provider 및 trackDetail 문서 데이터 준비
      const providerDoc: ProviderDoc = { providerName: getProviderNameFromLLMModel(model) };
      const trackDetailDoc: TrackDetailDoc = {
        summary,
        lyricsSplitIndices: lyricsSplitIndices,
        lyricsProvider,
        translations,
        paragraphSummaries,
      };

      // 8) provider 및 trackDetail 문서 DB에 저장
      const providerDocRef = admin
        .firestore()
        .collection("tracks")
        .doc(track.trackId)
        .collection("providers")
        .doc(model) as DocumentReference<ProviderDoc>;
      const trackDetailDocRef = providerDocRef
        .collection("details")
        .doc(language) as DocumentReference<TrackDetailDoc>;

      admin.firestore().runTransaction(async (transaction) => {
        // 8-1) 제공자 문서 생성
        transaction.create(providerDocRef, providerDoc);

        // 8-2) 트랙 상세 정보 저장
        transaction.set(trackDetailDocRef, trackDetailDoc);
      });

      // 9) 최종 결과 반환
      return { trackDetail: trackDetailDoc, provider: providerDoc };
    } catch (error) {
      logger.error("An error occurred in getDetailFlow", error);
      throw error;
    }
  }
);
