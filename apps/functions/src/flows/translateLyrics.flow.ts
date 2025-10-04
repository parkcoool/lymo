import { z } from "genkit";
import {
  LyricsSetEventSchema,
  TranslationSetEventSchema,
} from "@lymo/schemas/event";

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
  z
    .array(
      z.object({
        start: z.number().describe("The start time of the sentence in seconds"),
        end: z.number().describe("The end time of the sentence in seconds"),
        text: z.string().describe("The translated text of the sentence"),
        translation: z.string().describe("The translated text of the sentence"),
      })
    )
    .describe("A paragraph of translated lyrics")
);

export const translateLyricsFlow = ai.defineFlow(
  {
    name: "translateLyricsFlow",
    inputSchema: TranslateLyricsInputSchema,
    streamSchema: z.discriminatedUnion("event", [
      LyricsSetEventSchema,
      TranslationSetEventSchema,
    ]),
    outputSchema: TranslateLyricsOutputSchema,
  },
  async ({ title, artist, album, lyrics }, { sendChunk }) => {
    const { stream } = ai.generateStream({
      system: `
      ### 역할 (Role)
      전문 가사 번역가

      ### 가사 분석 지침 (Lyrics Analysis Guidelines)
      - 송 폼 (verse, chorus, bridge 등)을 인식하고, 이 단위로 문단을 분할할 것
      - 제공된 문장 구분을 쪼개거나 병합하지 말 것
      - 한국어인 문장은 영어로, 영어인 문장은 한국어로 번역할 것
      - 문화적 맥락이 강한 표현(예: 관용구, 속담 등)은 자연스러운 현지 표현으로 번역할 것
      - 가사에 특정 인물, 장소, 사건이 언급된 경우, 해당 맥락을 고려하여 번역할 것
      - 원본 가사의 운율과 리듬을 최대한 유지하려고 노력할 것

      ### 출력 형식 (Output Format)
      - 번역된 가사를 문단 단위로 배열로 묶어 출력할 것
      - 각 문단은 문장 단위로 배열로 묶어 출력할 것
      - 문장 단위 배열에서 번역이 불가능한 문장은 null로 표기할 것

      ### 출력 예시 (Output Example)
      [
        ["This is first sentence of first paragraph.", "This is second sentence of first paragraph."],
        ["This is first sentence of second paragraph.", null, "This is third sentence of second paragraph."]
      ]
      `,
      prompt: JSON.stringify({ title, artist, album, lyrics }),
      output: {
        schema: z.array(z.array(z.string().nullable())),
      },
      config: {
        temperature: 0.3,
      },
    });

    const result: z.infer<typeof TranslateLyricsOutputSchema> = [[]];
    let p = 0,
      s = 0,
      i = 0;
    for await (const chunk of stream) {
      const paragraphs = chunk.output;
      if (paragraphs === null) continue;
      for (; p < paragraphs.length; p++, s = 0, i++) {
        if (result.length <= p) result.push([]);

        const sentences = paragraphs[p];
        for (; s < sentences.length; s++, i++) {
          const sentence = sentences[s];
          if (result[p].length <= s)
            result[p].push({ ...lyrics[i], translation: sentence ?? "" });
          else result[p][s] = { ...lyrics[i], translation: sentence ?? "" };

          sendChunk({
            event: "lyrics_set",
            data: {
              paragraphIndex: p,
              sentenceIndex: s,
              text: lyrics[i].text,
              start: lyrics[i].start,
              end: lyrics[i].end,
            },
          });
          sendChunk({
            event: "translation_set",
            data: {
              paragraphIndex: p,
              sentenceIndex: s,
              text: sentence ?? "",
            },
          });

          if (sentences.length - 1 === s) {
            break;
          }
        }

        if (paragraphs.length - 1 === p) {
          break;
        }
      }
    }

    return result;
  }
);
