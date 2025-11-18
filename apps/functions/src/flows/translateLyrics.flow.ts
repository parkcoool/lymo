import { TranslationSetEventSchema } from "@lymo/schemas/event";
import { LanguageSchema } from "@lymo/schemas/shared";
import { logger } from "firebase-functions";
import { z } from "genkit";

import ai from "@/core/genkit";

export const TranslateLyricsInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  album: z.string().nullable().describe("The album of the song"),
  lyrics: z
    .array(
      z.object({
        start: z.number().describe("The start time of the sentence in seconds"),
        end: z.number().describe("The end time of the sentence in seconds"),
        text: z.string().describe("The text of the sentence"),
      })
    )
    .describe("The lyrics of the song"),
  language: LanguageSchema.describe("The target language for translation"),
});

export const TranslateLyricsOutputSchema = z.array(
  z.string().nullable().describe("The translated text of the sentence")
);

export const translateLyricsFlow = ai.defineFlow(
  {
    name: "translateLyricsFlow",
    inputSchema: TranslateLyricsInputSchema,
    streamSchema: TranslationSetEventSchema,
    outputSchema: TranslateLyricsOutputSchema,
  },
  async ({ title, artist, album, lyrics, language }, { sendChunk }) => {
    let retry = 0;
    let result: (string | null)[] | null = null;

    while (retry < 3) {
      const { stream, response } = ai.generateStream({
        system: `
          ### Identity
          You are an expert in translating song lyrics.

          ### Core Principles
          - Prioritize adaptation, avoid literal translation: This is the most crucial principle. You must strictly avoid mechanical word-for-word translation.
          - Cultural Transcendence: Idioms, slang, and expressions with strong cultural backgrounds must be re-created into natural expressions that can be understood and resonated with.

          ### Constraints
          - Do not arbitrarily combine or separate the sentence divisions of the input lyrics.
          - Treat parts that are untranslatable or meaningless (e.g., simple ad-libs/exclamations) as null.

          ### Output Format
          - The translated sentences must match the order of the sentences in the input lyrics.
          - Return a one-dimensional array containing only the translated sentences.

          ### Output Example
          Target Language: Korean
          Input: ["Hello, world!", "It's a beautiful day.", "안녕하세요!"]
          Output: ["안녕, 세상!", "아름다운 날이야.", null]
      `,
        model: "googleai/gemini-2.5-flash-lite",
        prompt: JSON.stringify({
          title,
          artist,
          album,
          lyrics,
          targetLanguage: language,
        }),
        output: {
          schema: TranslateLyricsOutputSchema,
        },
        config: {
          temperature: 0.3,
        },
      });

      // 현재 처리 중인 문장의 인덱스
      let sentenceIndex = 0;
      // 각 문장별로 이미 전송한 문자 길이를 추적 (중복 전송 방지)
      const sentenceProgress: number[] = [];

      for await (const chunk of stream) {
        // "null" 문자열을 실제 null로 변환하여 번역 배열 추출
        const translations =
          chunk.output?.map((item) => (item?.trim() === "null" ? null : item)) ?? null;
        if (translations === null) continue;

        // 현재 청크에 포함된 모든 문장을 순회
        for (; sentenceIndex < translations.length; sentenceIndex++) {
          const translation = translations[sentenceIndex];
          // 번역 불가능한 문장(ad-lib 등)은 건너뛰기
          if (translation === null) continue;

          // 이전 청크에서 이미 전송한 길이를 확인
          const previousLength = sentenceProgress[sentenceIndex] ?? 0;
          // 새로 생성된 부분만 추출
          const newContent = translation.slice(previousLength);

          // 실제로 새로운 내용이 있을 때만 클라이언트에 전송
          if (newContent.length > 0) {
            sendChunk({
              event: "translation_set",
              data: {
                sentenceIndex,
                text: newContent,
              },
            });
            // 현재 문장의 전송 진행 상황 업데이트
            sentenceProgress[sentenceIndex] = translation.length;
          }
        }
      }

      result =
        (await response).output?.map((item) => (item?.trim() === "null" ? null : item)) ?? null;

      // 번역 문장 개수가 입력된 문장 개수와 일치하는지 확인
      if (result !== null && result.length === lyrics.length) return result;
      else retry++;
    }

    // 3회 재시도 후에도 실패한 경우 마지막 결과 반환
    logger.warn(`translateLyricsFlow: translation count mismatch after retries.`, {
      expected: lyrics.length,
      actual: result?.length ?? 0,
      retries: retry,
      track: { title, artist, album },
    });
    return result ?? [];
  }
);
