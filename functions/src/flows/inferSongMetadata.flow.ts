import { z } from "genkit";

import ai from "../core/genkit";

export const inferSongMetadataInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  reference: z.string().optional().describe("Reference text"),
});

export const inferSongMetadataOutputSchema = z.object({
  englishTitle: z.string().nullable().describe("The English title of the song"),
  koreanTitle: z.string().nullable().describe("The Korean title of the song"),
  englishArtist: z
    .string()
    .nullable()
    .describe("The English name of the artist"),
  koreanArtist: z.string().nullable().describe("The Korean name of the artist"),
});

export const inferSongMetadataFlow = ai.defineFlow(
  {
    name: "inferSongMetadataFlow",
    inputSchema: inferSongMetadataInputSchema,
    outputSchema: inferSongMetadataOutputSchema,
  },
  async ({ title, artist, reference }) => {
    const { output: metadatas } = await ai.generate({
      system: `
          # 역할(Role)
          너는 음악 메타데이터를 구축하고 관리하는 최고 수준의 전문가이다. 너의 최우선 가치는 '정확성'과 '일관성'이다.
    
          # 임무(Task)
          너는 오타가 있을 수 있는 {rawTitle}, {rawArtist}과 참조용 {reference}을 입력받는다.
          이 정보를 바탕으로 아래 단계를 논리적으로 수행한다.
    
          # 처리 단계(Chain-of-Thought)
          1.  **분석 및 추론:**
              * {reference}의 내용을 분석하여 가장 가능성이 높은 정확한 아티스트와 노래 제목을 추론한다.
    
          2.  **정보 교정 및 확정:**
              * 추론을 바탕으로 정확한 한국어 아티스트명(koreanArtist)과 노래 제목(koreanTitle)을 확정한다.
    
          3.  **영문명 탐색:**
              * 확정된 아티스트의 공식 영문 활동명(englishArtist)을 추론한다. (주의: 단순 로마자 표기가 아님)
              * 확정된 노래의 공식 영문 제목(englishTitle)을 추론한다. (주의: 기계 번역이나 직역이 아님)
    
          ### 예외 처리 규칙(Rules)
          주어진 정보만으로 아티스트의 공식 활동명이나 노래의 공식 제목을 알 수 없으면 각 값은 null 값으로 설정한다.
          `,
      prompt: JSON.stringify({ rawTitle: title, rawArtist: artist, reference }),
      output: {
        schema: inferSongMetadataOutputSchema,
      },
      config: {
        temperature: 0.3,
      },
    });

    if (metadatas === null) {
      throw new Error("Response doesn't satisfy schema.");
    }

    if (metadatas.englishArtist === "null") metadatas.englishArtist = null;
    if (metadatas.koreanArtist === "null") metadatas.koreanArtist = null;
    if (metadatas.englishTitle === "null") metadatas.englishTitle = null;
    if (metadatas.koreanTitle === "null") metadatas.koreanTitle = null;

    return metadatas;
  }
);
