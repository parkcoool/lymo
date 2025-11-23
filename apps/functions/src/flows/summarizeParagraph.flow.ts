import {
  AppendParagraphSummaryEventSchema,
  UpdateParagraphSummaryEventSchema,
} from "@lymo/schemas/event";
import { LanguageSchema } from "@lymo/schemas/shared";
import { logger } from "firebase-functions";
import { z } from "genkit";

import ai from "@/core/genkit";

export const SummarizeParagraphInputSchema = z.object({
  track: z.object({
    title: z.string().describe("The title of the song"),
    artist: z.string().describe("The artist of the song"),
    album: z.string().nullable().describe("The album of the song"),
  }),
  lyrics: z
    .array(
      z.array(z.string().describe("A sentence in the lyrics")).describe("A paragraph in the lyrics")
    )
    .describe("The lyrics of the song, organized by paragraphs"),
  config: z.object({
    language: LanguageSchema.describe("The target language of the summaries"),
  }),
});

export const SummarizeParagraphStreamSchema = z.union([
  AppendParagraphSummaryEventSchema,
  UpdateParagraphSummaryEventSchema,
]);

export const SummarizeParagraphOutputSchema = z.array(z.string().nullable());

export const summarizeParagraphFlow = ai.defineFlow(
  {
    name: "summarizeParagraphFlow",
    inputSchema: SummarizeParagraphInputSchema,
    streamSchema: SummarizeParagraphStreamSchema,
    outputSchema: SummarizeParagraphOutputSchema,
  },
  async ({ track, lyrics, config: { language } }, { sendChunk }) => {
    let retry = 0;
    let result: (string | null)[] | null = null;

    while (retry < 3) {
      const { stream, response } = ai.generateStream({
        system: `
          ### Role
          Expert Lyric Analyst

          ### Lyrics Analysis Guidelines
          - The given lyrics are separated by paragraphs.
          - Write an analysis for each paragraph.
          - The analysis must concisely summarize the core content of the respective paragraph.
          - The analysis must be written as a single paragraph.

          ### Output Format
          - All summaries must be written in the given target language.
          - Output an array containing the summaries corresponding to each paragraph.
          - Treat paragraphs that do not require analysis as null.

          ### Output Example
          ["Summary of the first paragraph", "Summary of the second paragraph", null, "Summary of the fourth paragraph"]
      `,
        prompt: JSON.stringify({ track, lyrics, targetLanguage: language }),
        output: {
          schema: z.array(z.string().nullable()),
        },
        config: {
          // 재시도 시 temperature 점진적 증가
          temperature: retry * 0.2 + 0.3,
        },
      });

      let p = 0,
        s = 0;
      for await (const chunk of stream) {
        const summaries =
          chunk.output?.map((item) => (item?.trim() === "null" ? null : item)) ?? null;
        if (summaries === null) continue;
        for (; p < summaries.length; p++, s = 0) {
          const summary = summaries[p];

          // 요약이 null인 경우
          if (summary === null) {
            sendChunk({
              event: "update_paragraph_summary",
              data: {
                paragraphIndex: p,
                paragraphSummary: null,
              },
            });
            continue;
          }

          // 요약이 null이 아닌 경우
          else {
            sendChunk({
              event: "append_paragraph_summary",
              data: {
                paragraphIndex: p,
                paragraphSummary: summary.slice(s, summary.length),
              },
            });
          }
          s = summary.length;

          if (p === summaries.length - 1) break;
        }
      }

      result =
        (await response).output?.map((item) => (item?.trim() === "null" ? null : item)) ?? null;

      // 문단 요약 개수가 입력된 문단 개수와 일치하면 결과 반환
      if (result !== null && result.length === lyrics.length) return result;
      else retry++;
    }

    // 3회 재시도 후에도 실패한 경우 마지막 결과 반환
    logger.warn(`summarizeParagraphFlow: summary count mismatch after retries.`, {
      expected: lyrics.length,
      actual: result?.length ?? 0,
      retries: retry,
      track,
    });
    return result ?? [];
  }
);
