import { type Genkit, z } from "genkit";
import dotenv from "dotenv";

dotenv.config();

const processLyricsInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  duration: z.number().describe("The duration of the song in seconds"),
});

const processLyricsOutputSchema = z.object({
  overview: z.string().describe("An overall analysis of the lyrics"),
  paragraphs: z
    .array(
      z.object({
        setences: z.array(
          z
            .object({
              start: z
                .number()
                .describe("The start time of the sentence in seconds"),
              end: z
                .number()
                .describe("The end time of the sentence in seconds"),
              text: z.string().describe("The text of the sentence"),
              translation: z
                .union([z.null(), z.string()])
                .describe("The translation of the sentence"),
            })
            .describe("A sentence in the lyrics")
        ),
        summary: z
          .union([z.null(), z.string()])
          .describe("A brief summary of the paragraph"),
      })
    )
    .describe("The paragraphs of the lyrics"),
});

export const registerProcessLyricsFlow = (ai: Genkit) =>
  ai.defineFlow(
    {
      name: "lyricsProcessFlow",
      inputSchema: processLyricsInputSchema,
      outputSchema: processLyricsOutputSchema,
    },
    async ({ title, artist, duration }) => {
      const { output } = await ai.generate({
        system: `
          너는 음악 평론가이자 가사 분석 전문가야.
          주어지는 곡의 가사를 분석해서, 곡에 대한 전반적인 소개와 각 문단에 대한 해석을 제공해줘.
          가져온 가사에 포함된 타임스탬프 값과 가사 원문은 절대로 변경하지 마.
          먼저 곡에 대한 전반적인 소개를 2문단 내외의 분량의 한국어로 제공해줘.
          각 문장의 translation에 한국어는 영어로, 영어는 한국어로 번역해서 제공해줘.
          문맥에 따라 문장들을 문단으로 나누고 summary에 깊이 있는 한국어 해석을 제공해.
          각 문단과 라인의 분량이 너무 짧거나 해석이 불필요한 경우, 해석을 생략할 수 있어.
          만약 가사를 찾을 수 없으면, overview는 "가사를 찾을 수 없습니다."로, paragraphs는 빈 배열로 응답해줘.
          `,
        prompt: `
          {
            "title": "${title}",
            "artist": "${artist}",
            "duration": ${duration}
          }
          위 JSON 객체는 사용자가 요청한 노래의 메타데이터야.`,
        tools: ["getLyrics"],
        output: {
          schema: processLyricsOutputSchema,
        },
        config: {
          temperature: 0.3,
        },
      });

      if (output === null) {
        throw new Error("Response doesn't satisfy schema.");
      }

      return output;
    }
  );
