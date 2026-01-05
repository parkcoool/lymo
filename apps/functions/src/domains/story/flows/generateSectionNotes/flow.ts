import { vertexAI } from "@genkit-ai/google-genai";
import { logger } from "firebase-functions";
import { ValidationError } from "genkit/schema";

import { ai } from "@/config";
import getLanguageName from "@/shared/utils/getLanguageName";

import { InputSchema, OutputSchema, StreamSchema } from "./schemas";

const MAX_RETRIES = 3;

export const generateSectionNotesFlow = ai.defineFlow(
  {
    name: "generateSectionNotesFlow",
    inputSchema: InputSchema,
    streamSchema: StreamSchema,
    outputSchema: OutputSchema,
  },
  async ({ trackInfo: track, lyrics, config: { language } }, { sendChunk }) => {
    if (lyrics.length <= 1) return [];

    let retry = 0;
    let result: (string | null)[] | null = null;

    while (retry < MAX_RETRIES) {
      try {
        const { stream, response } = ai.generateStream({
          system: `
            ### Role
            Specialized Lyric Annotator (Focus on Context, Trivia & Behind-the-Scenes)
  
            ### Selection & Analysis Guidelines
            1. Information Gathering
            - USE WEB SEARCH: Actively search the web to find accurate and interesting facts, trivia, and context about the song and its specific sections.
  
            2. Content Focus (Broader Context over Word Definitions)
            - Do NOT explain individual words or phrases unless they are crucial for the bigger picture.
            - Instead, provide interesting insights such as:
                - Section Meaning: The role or emotional weight of this section within the whole song's narrative.
                - Behind-the-Scenes: Stories about the recording, writing, or production of this specific part.
                - Performer Info: Interesting facts about the member/artist singing this part (if applicable/known).
                - Trivia: Any unique facts related to this section.
  
            3. Selection Criteria
            - SKIP THE OBVIOUS: If the meaning is easily inferable by anyone, DO NOT explain it.
            - ACTIVELY RETURN NULL: If there is no specific interesting backstory, trivia, or deeper narrative significance, you MUST output \`null\`. Do not force an explanation.
            - Only provide output if you find something worth reading that goes beyond a simple summary of the lyrics.
  
            4. Format & Length
            - Length Limit: Strictly limit the output to 2~3 sentences.
            - Tone: Informative, engaging, and insightful, like a 'Genius.com' annotation or a director's commentary.
  
            ### Output Format
            - All summaries must be written in the given target language.
            - Output an array containing the summaries corresponding to each section.
  
            ### Output Example
            ["Summary of the first section", "Summary of the second section", null, "Summary of the fourth section"]
        `,
          model: vertexAI.model("gemini-2.5-flash"),
          prompt: JSON.stringify({ track, lyrics, targetLanguage: getLanguageName(language) }),
          output: { schema: OutputSchema },
          config: {
            googleSearchRetrieval: {},
          },
        });

        let p = 0,
          s = 0;
        for await (const chunk of stream) {
          if (!OutputSchema.safeParse(chunk.output).success) continue;

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

        try {
          const output = OutputSchema.parse((await response).output);
          result = output;
          // 문단 요약 개수가 입력된 문단 개수와 일치하면 결과 반환
          if (output.length === lyrics.length)
            return output.map((item) => (item?.trim() === "null" ? null : item));
        } catch {}
      } catch (error) {
        if (error instanceof ValidationError) {
          logger.warn(`generateSectionNotesFlow: ValidationError occurred.`, {
            error,
            track,
          });
        } else throw error;
      }

      retry++;
    }

    // 재시도 후에도 실패한 경우 마지막 결과 반환
    logger.warn(`generateSectionNotesFlow: summary count mismatch after retries.`, {
      expected: lyrics.length,
      actual: result?.length ?? 0,
      retries: retry,
      track,
    });
    return result ?? [];
  }
);
