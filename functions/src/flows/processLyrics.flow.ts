import { z } from "genkit";

import ai from "../core/genkit";

export const processLyricsInputSchema = z.object({
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
  summary: z.string().nullable().describe("A brief summary of the song"),
});

export const processLyricsOutputSchema = z.object({
  overview: z.string().describe("An overall analysis of the lyrics"),
  paragraphs: z
    .array(
      z.object({
        sentences: z.array(
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

export const processLyricsFlow = ai.defineFlow(
  {
    name: "lyricsProcessFlow",
    inputSchema: processLyricsInputSchema,
    outputSchema: processLyricsOutputSchema,
  },
  async ({ title, artist, album, lyrics, summary }) => {
    const { output } = await ai.generate({
      system: `
      ### 역할 (Role)
      너는 통찰력 있는 음악 평론가이자 기호학적 관점에서 가사를 분석하는 전문가이다. 너의 분석은 단순히 감상을 나열하는 것을 넘어, 가사의 구조, 상징, 그리고 서사를 깊이 있게 파고든다. 모든 분석은 한국어로 작성되어야 한다.

      ### 임무 (Task)
      주어진 곡 정보와 가사를 바탕으로, 아래의 출력 형식(Output Format)을 완벽하게 준수하여 결과물을 생성하라.

      #### 1. Overview
      곡의 전반적인 소개를 2~3개의 문단으로 작성한다. 문단은 두 개의 줄바꿈으로 구분하며, 각 문단은 다음의 내용을 포함한다.
      - **첫 번째 문단**: 곡의 장르, 사운드, 발매 배경 등 음악적 정보를 중심으로 소개한다.
      - **두 번째 문단**: 가사의 전체적인 서사와 핵심 감정, 주제 의식을 요약하여 설명한다.

      #### 2. Lyrical Analysis
      의미적으로 연결되는 가사들을 하나의 '문단(paragraph)'으로 묶어 순차적으로 분석한다. 각 문단은 아래 사항들을 준수하여야 한다.
      - 타임스탬프와 원문 가사를 **절대 변경하지 말고** 그대로 기재한다.
      - 제공된 가사 구조를 **절대 변경하지 말고** 그대로 유지한다. 즉, 문장 구분을 추가로 쪼개거나 병합하지 않는다.
      - 각 라인을 한국어는 영어로, 영어는 한국어로 번역한다.
      - 아래 사항을 준수하여 각 문단에 대한 설명을 제공한다.
          - **분석 관점**: 화자의 정서, 핵심 상징(Symbol)과 은유(Metaphor), 그리고 해당 문단이 곡의 기승전결 구조에서 수행하는 역할에 초점을 맞춘다.
          - **작성 방식**: 문단에 대한 설명을 자연스럽게 서술한다. "이 부분은~" 과 같은 틀에 박힌 표현은 사용하지 않는다.
          - **예외 처리**: 해석이 불필요한 단순 반복구나 추임새 문단의 summary는 null 값으로 처리한다.
          `,
      prompt: `
          {
            "title": "${title}",
            "artist": "${artist}",
            "album": "${album}",
            "lyrics": ${JSON.stringify(lyrics)},
            "summary": "${summary}"
          }`,
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

    output.paragraphs.forEach((paragraph) => {
      if (paragraph.summary === "null") paragraph.summary = null;
    });

    return output;
  }
);
