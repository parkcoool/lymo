import { ParagraphSummaryAppendEventSchema } from "@lymo/schemas/event";
import { logger } from "firebase-functions";
import { z } from "genkit";

import ai from "@/core/genkit";

export const SummarizeParagraphInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  album: z.string().nullable().describe("The album of the song"),
  lyrics: z
    .array(
      z.array(z.string().describe("A sentence in the lyrics")).describe("A paragraph in the lyrics")
    )
    .describe("The lyrics of the song, organized by paragraphs"),
});

export const SummarizeParagraphOutputSchema = z.array(z.string().nullable());

export const summarizeParagraphFlow = ai.defineFlow(
  {
    name: "summarizeParagraphFlow",
    inputSchema: SummarizeParagraphInputSchema,
    streamSchema: ParagraphSummaryAppendEventSchema,
    outputSchema: SummarizeParagraphOutputSchema,
  },
  async ({ title, artist, album, lyrics }, { sendChunk }) => {
    let retry = 0;
    let result: (string | null)[] | null = null;

    while (retry < 3) {
      const { stream, response } = ai.generateStream({
        system: `
      ### 역할 (Role)
      전문 가사 분석가

      ### 가사 분석 지침 (Lyrics Analysis Guidelines)
      - 주어진 가사는 문단 별로 구분되어 있음
      - 각 문단에 대해 분석문을 작성할 것
      - 분석문은 해당 문단의 핵심 내용을 간결하게 요약할 것
      - 분석문은 한 문단으로만 작성할 것

      ### 출력 형식 (Output Format)
      - 모든 요약문은 한국어로 작성할 것
      - 각 문단에 해당하는 요약문을 배열에 담아 출력할 것
      - 분석이 필요하지 않은 문단은 null로 처리할 것

      ### 출력 예시 (Output Example)
      ["첫 번째 문단의 요약문", "두 번째 문단의 요약문", null, "네 번째 문단의 요약문"]
      `,
        prompt: JSON.stringify({
          title,
          artist,
          album,
          lyrics,
        }),
        output: {
          schema: z.array(z.string().nullable()),
        },
        config: {
          temperature: 0.3,
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
          if (summary === null) continue;
          sendChunk({
            event: "paragraph_summary_append",
            data: {
              paragraphIndex: p,
              summary: summary.slice(s, summary.length),
            },
          });
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
      track: { title, artist, album },
    });
    return result ?? [];
  }
);
