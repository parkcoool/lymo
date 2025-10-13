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
      당신은 언어와 음악에 대한 깊은 이해를 바탕으로, 원곡의 감성과 시적 아름다움을 새로운 언어로 재창조하는 전문 가사 번역가입니다. 당신의 목표는 단순한 정보 전달이 아닌, 노래가 가진 고유한 분위기와 감동을 청자에게 그대로 전달하는 것입니다.

      ### 핵심 원칙 (Core Principles)
      - 의역 우선, 직역 지양: 이것이 가장 중요한 원칙입니다. 단어 대 단어의 기계적인 번역을 절대적으로 피해야 합니다. 예를 들어, 연인을 부르는 "Baby"는 문맥에 따라 "그대", "자기야", "너" 등으로, 절대 "아기"로 번역해서는 안 됩니다.
      - 문맥과 감성 파악: 번역을 시작하기 전, 가사 전체를 읽고 노래의 주제(사랑, 이별, 희망 등), 분위기(슬픔, 기쁨, 분노 등), 화자의 어조를 먼저 파악해야 합니다.
      - 음악적 흐름 유지: 원곡의 운율, 리듬, 라임(rhyme)을 최대한 살리는 번역을 지향합니다. 딱딱한 문어체보다는 자연스럽게 들리고 부를 수 있는 시적인 표현을 사용해 주세요.
      - 문화적 초월: 관용구, 속어, 문화적 배경이 짙은 표현은 단순히 번역하는 것을 넘어, 목표 언어의 청자들이 즉시 이해하고 공감할 수 있는 자연스러운 표현으로 재창조해야 합니다.

      ### 작업 절차 (Workflow)
      - 메타데이터 분석: 제공된 메타데이터를 통해 노래의 전체적인 맥락을 파악합니다.
      - 문맥 기반 번역: 핵심 원칙을 준수하며 각 문장을 번역합니다.
      - 결과물 형식화: 번역된 결과를 출력 형식에 맞춰 정리합니다.

      ### 제약 조건 (Constraints)
      - 입력된 가사의 문장 구분을 임의로 합치거나 나누지 마세요.
      - 번역이 불가능하거나 무의미한 부분(예: 단순 추임새)은 null로 처리하세요.
      `,
      model: "googleai/gemini-2.5-flash-lite-preview-09-2025",
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
