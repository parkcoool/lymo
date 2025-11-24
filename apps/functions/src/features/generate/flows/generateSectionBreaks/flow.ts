import { logger } from "firebase-functions";
import { z } from "genkit";

import ai from "@/core/genkit";

import { InputSchema, OutputSchema } from "./schemas";

export const generateSectionBreaksFlow = ai.defineFlow(
  {
    name: "generateSectionBreaksFlow",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async ({ lyrics }) => {
    if (lyrics.length <= 1) return [];

    let retry = 0;
    let breakIndices: number[] | null = null;

    while (retry < 3) {
      const response = await ai.generate({
        system: `
          ### Role
          You are an Expert Lyric Paragraph Organizer. Your goal is to structure raw song lyrics into logical paragraphs (stanzas) to improve readability and synchronization.

          ### Task
          Analyze the provided list of lyric lines (including indices, timestamps, and text) and determine the optimal indices to insert paragraph breaks.

          ### Input Format
          You will receive a list of lines formatted as:
          \`Index {i} | Time: {start}~{end} | Text: "{content}"\`

          ### Step-by-Step Analysis Strategy
          1. **Calculate Time Gaps**: For each line \`i\`, calculate the silence gap before the next line starts: \`Gap = Line[i+1].start - Line[i].end\`.
            - *High Priority*: If \`Gap\` > 2.0 seconds, this is a very strong signal for a paragraph break.
            - *Medium Priority*: If \`Gap\` is between 1.0 and 2.0 seconds, check if the semantic context also shifts.
          2. **Analyze Semantic Flow**: Look for natural pauses in the narrative, changes in rhyme scheme, or transitions between song sections (e.g., Verse -> Chorus).
          3. **Balance Paragraph Length**:
            - Aim for paragraphs of **4 to 8 lines**.
            - Avoid creating very short paragraphs (1-2 lines) unless there is a massive time gap or a distinct exclamation.
            - Avoid overly long paragraphs (10+ lines) even if the time gaps are short.

          ### Constraints & Rules
          - **No Empty Results**: Unless the input has fewer than 4 lines, you MUST return at least one break index.
          - **Zero-based Indexing**: The output indices represent the line *after which* the paragraph ends.
            - Example: If you return \`[3]\`, it means the first paragraph is lines 0-3, and the second paragraph starts at line 4.
          - **Ascending Order**: The indices in the array must be sorted.

          ### Output Schema Requirement
          You must output a JSON object with two fields:
          1. \`reasoning\` (string): Briefly explain the logic. Mention specific time gaps you found (e.g., "Found 3s gap after line 3") and semantic reasons.
          2. \`breakIndices\` (array of numbers): The final list of indices.
        `,
        model: "googleai/gemini-2.5-flash-lite",

        // 가사 데이터를 LLM에 전달하기 위해 가공
        prompt: JSON.stringify(
          lyrics.map(
            (sentence, index) =>
              `Index ${index} | Time: ${sentence.start.toFixed(2)}~${sentence.end.toFixed(
                2
              )} | Text: "${sentence.text}"`
          )
        ),

        // 출력 스키마 정의
        output: {
          schema: z.object({
            reasoning: z.string().describe("The reasoning behind the chosen paragraph breaks"),
            breakIndices: OutputSchema,
          }),
        },
        config: { temperature: 0.3 },
      });

      breakIndices = response.output?.breakIndices ?? null;

      // 인덱스가 유효한 범위 내에 있는지 확인
      if (breakIndices !== null) {
        const isValid = breakIndices.every(
          (breakIndex) => breakIndex >= 0 && breakIndex < lyrics.length - 1
        );

        if (isValid) return breakIndices;
      }

      retry++;
    }

    // 3회 재시도 후에도 실패한 경우 빈 배열 반환
    logger.warn(
      `generateSectionBreaksFlow: failed to generate valid paragraph breaks after retries.`
    );
    return [];
  }
);
