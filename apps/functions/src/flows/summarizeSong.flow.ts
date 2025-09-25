import { z } from "genkit";
import ai from "../core/genkit";
import { SummaryAppendSchema } from "@lymo/schemas/addSong";

export const summarizeSongInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  album: z.string().nullable().describe("The album of the song"),
  lyrics: z
    .array(z.string().describe("A sentence from the lyrics"))
    .describe("The lyrics of the song"),
});

export const summarizeSongOutputSchema = z
  .string()
  .describe("The summary of the song");

export const summarizeSongFlow = ai.defineFlow(
  {
    name: "summarizeSongFlow",
    inputSchema: summarizeSongInputSchema,
    streamSchema: SummaryAppendSchema,
    outputSchema: summarizeSongOutputSchema,
  },
  async ({ title, artist, album, lyrics }, { sendChunk }) => {
    const { stream, response } = ai.generateStream({
      system: `
      ### 역할 (Role)
      주어진 노래의 가사와 메타데이터를 바탕으로, 노래의 내용을 요약하는 역할

      ### 목표 (Goal)
      - 곡의 주제, 메시지, 핵심 스토리라인을 포함할 것
      - 웹 검색을 활용하여 곡 발매 당시 사회적 맥락, 장르적 특성, 아티스트 배경을 포함할 것
      - 비하인드 스토리, 제작 과정, 대중적 반응을 포함해도 좋음

      ### 제약 조건 (Constraints)
      - 요약문은 2~3 문단으로 구성할 것
      - 문단은 줄바꿈 문자 2개로 구분할 것
      - 요약문은 한국어로 작성할 것
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

    for await (const chunk of stream) {
      sendChunk({
        event: "summary_append",
        data: { summary: chunk.text },
      });
    }

    const result = (await response).text;
    return result;
  }
);
