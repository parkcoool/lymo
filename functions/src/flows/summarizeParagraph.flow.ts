import { z } from "genkit";
import ai from "../core/genkit";

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
    streamSchema: summarizeParagraphOutputSchema,
    outputSchema: summarizeParagraphOutputSchema,
  },
  async ({ title, artist, album, lyrics }, { sendChunk }) => {
    const { stream, response } = ai.generateStream({
      system: `
      ### 역할 (Role)
      전문 가사 분석가

      #### 가사 분석 지침 (Lyrics Analysis Guidelines)
      - 주어진 가사는 문단 별로 구분되어 있음
      - 각 문단에 대해 요약문을 작성하되, 요약이 필요 없으면 "null"을 반환할 것

      ### 출력 형식 (Output Format)
      - 모든 요약문은 항상 줄바꿈 문자 **한 개**로 구분할 것
      - 모든 요약문은 한국어로 작성할 것

      ### 출력 예시 (Output Example)
      첫 번째 문단의 요약문입니다.
      두 번째 문단의 요약문입니다.
      null
      네 번째 문단의 요약문입니다.
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

    let result = "";
    for await (const chunk of stream) {
      result += chunk.text;
      sendChunk(
        result
          .split("\n")
          .map((line) => line.trim())
          .map((line) => (line === "null" ? null : line))
          .filter((line) => line !== "")
      );
    }

    return (await response).text
      .split("\n")
      .map((line) => line.trim())
      .map((line) => (line === "null" ? null : line))
      .filter((line) => line !== "");
  }
);
