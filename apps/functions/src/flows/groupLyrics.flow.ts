import { logger } from "firebase-functions";
import { z } from "genkit";

import ai from "@/core/genkit";

export const GroupLyricsInputSchema = z.object({
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

export const GroupLyricsOutputSchema = z.array(
  z.number().describe("An index where paragraphs should break")
);

export const groupLyricsFlow = ai.defineFlow(
  {
    name: "groupLyricsFlow",
    inputSchema: GroupLyricsInputSchema,
    outputSchema: GroupLyricsOutputSchema,
  },
  async ({ lyrics }) => {
    if (lyrics.length <= 1) return [];

    let retry = 0;
    let result: number[] | null = null;

    while (retry < 3) {
      const response = await ai.generate({
        system: `
          ### Role
          Expert Lyric Paragraph Organizer

          ### Task
          Analyze the given song lyrics and determine where paragraph breaks should occur.

          ### Guidelines
          - Consider the semantic meaning and flow of the lyrics.
          - Consider the timing information (start/end times) of each line.
          - Group lines that belong to the same thematic or narrative unit.
          - Aim for paragraphs with 4-7 lines each, but prioritize semantic coherence over strict length.
          - Do not create breaks at positions where the flow would be awkward.

          ### Output Format
          - Return an array of indices (0-based) where paragraph breaks should occur.
          - Each index represents the position AFTER which a new paragraph should start.
          - For example, [2, 5] means: break after line 2 (so line 3 starts a new paragraph) and break after line 5 (so line 6 starts a new paragraph).
          - The indices must be in ascending order.
          - Return an empty array if no breaks are needed.

          ### Output Example
          Input: 10 lines of lyrics
          Output: [2, 5, 8] (creates 4 paragraphs: lines 0-2, 3-5, 6-8, 9)
        `,
        model: "googleai/gemini-2.5-flash-lite",
        prompt: JSON.stringify({ lyrics }),
        output: {
          schema: GroupLyricsOutputSchema,
        },
        config: {
          temperature: 0.3,
        },
      });

      result = response.output ?? null;

      // 결과 검증: 인덱스가 유효한 범위 내에 있고 오름차순인지 확인
      if (result !== null) {
        const isValid = result.every(
          (idx, i, arr) => idx >= 0 && idx < lyrics.length - 1 && (i === 0 || idx > arr[i - 1])
        );

        if (isValid) return result;
      }

      retry++;
    }

    // 3회 재시도 후에도 실패한 경우 빈 배열 반환
    logger.warn(`groupLyricsFlow: failed to generate valid paragraph breaks after retries.`);
    return [];
  }
);
