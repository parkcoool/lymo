import { z } from "genkit";
import { TranslationSetEventSchema } from "@lymo/schemas/event";

import ai from "../core/genkit";

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
  async ({ title, artist, album, lyrics }, { sendChunk }) => {
    const { stream, response } = ai.generateStream({
      system: `
      ### 정체성 (Identity)
      당신은 음악의 가사를 번역하는 전문가입니다.

      ### 핵심 원칙 (Core Principles)
      - 의역 우선, 직역 지양: 이것이 가장 중요한 원칙입니다. 단어 대 단어의 기계적인 번역을 절대적으로 피해야 합니다.
      - 문화적 초월: 관용구, 속어, 문화적 배경이 짙은 표현은 이해하고 공감할 수 있는 자연스러운 표현으로 재창조해야 합니다.

      ### 제약 조건 (Constraints)
      - 입력된 가사의 문장 구분을 임의로 합치거나 나누지 마세요.
      - 번역이 불가능하거나 무의미한 부분(예: 단순 추임새)은 null로 처리하세요.

      ### 출력 형식 (Output Format)
      - 번역된 문장은 입력된 가사의 문장 순서와 일치해야 합니다.
      - 번역한 문장만 포함된 1차원 배열을 반환하세요.

      ### 출력 예시 (Output Example)
      입력: ["Hello, world!", "It's a beautiful day."]
      출력: ["안녕, 세상!", "아름다운 날이야."]
      `,
      model: "googleai/gemini-2.5-flash-lite",
      prompt: JSON.stringify({ title, artist, album, lyrics }),
      output: {
        schema: TranslateLyricsOutputSchema,
      },
      config: {
        temperature: 0.3,
      },
    });

    let s = 0,
      i = 0;
    for await (const chunk of stream) {
      const translations = chunk.output;
      if (translations === null) continue;
      for (; s < translations.length; s++, i = 0) {
        const translation = translations[s];
        if (translation === null) continue;
        sendChunk({
          event: "translation_set",
          data: {
            sentenceIndex: s,
            text: translation.slice(i, translation.length),
          },
        });
        i = translation.length;

        if (s === translations.length - 1) break;
      }
    }

    const result = (await response).output;
    if (result === null) return [];
    return result;
  }
);
