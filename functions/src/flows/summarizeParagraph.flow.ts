import { z } from "genkit";
import ai from "../core/genkit";
import { ParagraphSummaryAppendSchema } from "./addSong.schema";

export const summarizeParagraphInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  album: z.string().nullable().describe("The album of the song"),
  lyrics: z
    .array(
      z
        .array(z.string().describe("A sentence in the lyrics"))
        .describe("A paragraph in the lyrics")
    )
    .describe("The lyrics of the song, organized by paragraphs"),
});

export const summarizeParagraphOutputSchema = z.array(z.string().nullable());

export const summarizeParagraphFlow = ai.defineFlow(
  {
    name: "summarizeParagraphFlow",
    inputSchema: summarizeParagraphInputSchema,
    streamSchema: ParagraphSummaryAppendSchema,
    outputSchema: summarizeParagraphOutputSchema,
  },
  async ({ title, artist, album, lyrics }, { sendChunk }) => {
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
      - 각 문단에 해당하는 요약문을 줄바꿈으로 구분하여 출력할 것
      - 분석이 필요하지 않은 문단은 빈 줄로 출력할 것

      ### 출력 예시 (Output Example)
      1번 문단 분석문입니다.
      2번 문단 분석문입니다.
      
      4번 문단 분석문입니다.
      `,
      prompt: JSON.stringify({
        title,
        artist,
        album,
        lyrics,
      }),
      config: {
        temperature: 0.3,
      },
    });

    let index = 0;
    for await (const chunk of stream) {
      const summaries = chunk.text.split("\n").map((line) => line.trim());

      for (
        let paragraphIndex = index;
        paragraphIndex < index + summaries.length;
        paragraphIndex++
      ) {
        sendChunk({
          event: "paragraph_summary_append",
          data: {
            paragraphIndex,
            summary: summaries[paragraphIndex - index],
          },
        });
      }

      index += summaries.length - 1;
    }

    const result = (await response).text
      .split("\n")
      .map((line) => line.trim() || null);
    return result;
  }
);
