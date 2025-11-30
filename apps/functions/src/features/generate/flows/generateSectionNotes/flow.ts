import { logger } from "firebase-functions";
import { z } from "genkit";

import ai from "@/core/genkit";

import { InputSchema, OutputSchema, StreamSchema } from "./schemas";

export const generateSectionNotesFlow = ai.defineFlow(
  {
    name: "generateSectionNotesFlow",
    inputSchema: InputSchema,
    streamSchema: StreamSchema,
    outputSchema: OutputSchema,
  },
  async ({ trackInfo: track, lyrics, config: { language } }, { sendChunk }) => {
    let retry = 0;
    let result: (string | null)[] | null = null;

    while (retry < 3) {
      const { stream, response } = ai.generateStream({
        system: `
          ### Role
          Expert Lyric Analyst

          ### Lyrics Analysis Guidelines
          - The given lyrics are separated by sections.
          - Write an analysis for each section.
          - The analysis must concisely summarize the core content of the respective section.
          - The analysis must be written as a single section.

          ### Output Format
          - All summaries must be written in the given target language.
          - Output an array containing the summaries corresponding to each section.
          - Treat sections that do not require analysis as null.

          ### Output Example
          ["Summary of the first section", "Summary of the second section", null, "Summary of the fourth section"]
      `,
        prompt: JSON.stringify({ track, lyrics, targetLanguage: language }),
        output: { schema: z.string().nullable().array() },
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
            sendChunk({ type: "update", text: null, sectionIndex: p });
            continue;
          }

          // 요약이 null이 아닌 경우
          sendChunk({ type: "append", text: summary.slice(s, summary.length), sectionIndex: p });
          s = summary.length;

          // 마지막 섹션인 경우 루프 종료
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
    logger.warn(`generateSectionNotesFlow: summary count mismatch after retries.`, {
      expected: lyrics.length,
      actual: result?.length ?? 0,
      retries: retry,
      track,
    });
    return result ?? [];
  }
);
