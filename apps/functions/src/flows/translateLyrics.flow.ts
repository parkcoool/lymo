import { LanguageSchema } from "@lymo/schemas/shared";
import { logger } from "firebase-functions";
import { z } from "genkit";

import ai from "@/core/genkit";
import calculateSimilarity from "@/utils/calculateSimilarity";
import detectLanguage from "@/utils/detectLanguage";

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

export const TranslateLyricsStreamSchema = z.object({
  sentenceIndex: z.number().describe("The index of the translated sentence"),
  translation: z.string().nullable().describe("The translated text of the sentence"),
});

export const TranslateLyricsOutputSchema = z.array(
  z.string().nullable().describe("The translated text of the sentence")
);

export const translateLyricsFlow = ai.defineFlow(
  {
    name: "translateLyricsFlow",
    inputSchema: TranslateLyricsInputSchema,
    streamSchema: TranslateLyricsStreamSchema,
    outputSchema: TranslateLyricsOutputSchema,
  },
  async ({ title, artist, album, lyrics, language }, { sendChunk }) => {
    // 1) 이미 목표 언어인 문장 필터링
    const needsTranslation = lyrics.map((lyric) => {
      const detectedLang = detectLanguage(lyric.text);
      return detectedLang !== language;
    });

    // 번역 결과 후처리 함수 (사전 필터링 + 유사도 검증)
    const validateTranslation = (translation: string | null, index: number): string | null => {
      // 사전 필터링에서 이미 번역 불필요로 판단된 경우
      if (!needsTranslation[index]) return null;

      // 번역이 null인 경우 그대로 유지
      if (translation === null) return null;

      // 원문과 번역문의 유사도가 너무 높으면 번역되지 않은 것으로 간주
      const similarity = calculateSimilarity(lyrics[index].text, translation);
      if (similarity > 0.6) return null;

      return translation;
    };

    let retry = 0;
    let result: (string | null)[] | null = null;

    while (retry < 3) {
      // 2) AI 번역 요청 및 스트리밍
      const { stream, response } = ai.generateStream({
        system: `
        ### Identity
        You are an expert in translating song lyrics.

        ### Input Format Specification
        You will receive a JSON object containing:
        1. \`targetLanguage\`: The specific language you must translate the lyrics into.
        2. \`lyrics\`: An array of strings representing the source lyrics.

        ### Core Principles
        - Prioritize adaptation, avoid literal translation: Avoid mechanical word-for-word translation.
        - Cultural Transcendence: Re-create idioms and slang into natural expressions in the \`targetLanguage\`.

        ### Constraints
        - **CRITICAL RULE 1 (Language Enforcement):** You MUST translate the input lyrics into the language specified in the \`targetLanguage\` field of the input JSON.
            - DO NOT output in English unless \`targetLanguage\` is "English".
            - Even if the input is mixed, the output must be solely in the \`targetLanguage\`.
        - **CRITICAL RULE 2 (Already Translated):** If an input sentence is ALREADY in the \`targetLanguage\`, return \`null\`. Do not repeat it.
        - **CRITICAL RULE 3 (Ad-libs):** If an input sentence consists **ENTIRELY** of non-semantic vocalizations (e.g., "Ooh", "Yeah", "La-la-la"), return \`null\`.
            - Exception: If ad-libs are mixed with words (e.g., "I love you (ooh)"), translate the sentence normally.
        - Do not arbitrarily combine or separate the sentence divisions.

        ### Output Format
        - Return a one-dimensional array containing only the translated sentences.

        ### Output Example
        **User Input (JSON):**
        \`\`\`json
        {
          "targetLanguage": "Korean",
          "lyrics": ["Hello world", "이건 한국어 문장", "Ooh-ooh", "It's a beautiful day"]
        }
        \`\`\`

        **Model Output:**
        \`\`\`json
        ["안녕 세상", null, null, "아름다운 날이야"]
        \`\`\`
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
          // 재시도 시 temperature 점진적 증가
          temperature: retry * 0.2 + 0.3,
        },
      });

      // 3) 스트리밍 처리

      // 현재 처리 중인 문장의 인덱스
      let sentenceIndex = 0;

      for await (const chunk of stream) {
        // "null" 문자열을 실제 null로 변환하여 번역 배열 추출
        const translations =
          chunk.output?.map((item) => (item?.trim() === "null" ? null : item)) ?? null;
        if (translations === null) continue;

        // 현재 청크에 포함된 모든 문장을 순회
        for (; sentenceIndex < translations.length; sentenceIndex++) {
          const translation = translations[sentenceIndex];
          const validatedTranslation = validateTranslation(translation, sentenceIndex);

          // 번역 결과 스트리밍 전송
          sendChunk({
            sentenceIndex,
            translation: validatedTranslation,
          });

          // 마지막 문장까지 처리했으면 종료
          if (sentenceIndex >= translations.length - 1) break;
        }
      }

      result =
        (await response).output?.map((item) => (item?.trim() === "null" ? null : item)) ?? null;

      // 4) 결과 검증 및 반환

      // 번역 문장 개수가 입력된 문장 개수와 일치하는지 확인
      if (result !== null && result.length === lyrics.length) {
        // 최종 결과에도 동일한 검증 로직 적용
        return result.map((translation, index) => validateTranslation(translation, index));
      }

      // 불일치하는 경우 재시도
      else {
        retry++;
      }
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
