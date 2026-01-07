import { vertexAI } from "@genkit-ai/google-genai";
import { ERROR_CODES } from "@lymo/schemas/error";
import { logger } from "firebase-functions/logger";
import { ValidationError } from "genkit/schema";

import { ai } from "@/config";
import KnownError from "@/shared/errors/KnownError";
import getLanguageName from "@/shared/utils/getLanguageName";

import { InputSchema, StreamSchema, OutputSchema } from "./schemas";

const MAX_RETRIES = 3;

export const generateTrackOverviewFlow = ai.defineFlow(
  {
    name: "generateTrackOverviewFlow",
    inputSchema: InputSchema,
    streamSchema: StreamSchema,
    outputSchema: OutputSchema,
  },
  async ({ trackInfo, config: { language } }, { sendChunk }) => {
    let retry = 0;

    while (retry < MAX_RETRIES) {
      try {
        const { stream, response } = ai.generateStream({
          system: `
          ### Role
          Based on the metadata of a song, summarize the song's content.
  
          ### Goal
          - Include the song's theme, message, and core storyline.
          - Utilize web search to include the social context at the time of the song's release, its genre characteristics, and the artist's background.
          - May also include behind-the-scenes stories, production process, and public reception.
  
          ### Constraints
          - Sections must be separated by two newline characters.
          - The summary must be written in the given target language.
          - No markdown formatting.
        `,
          model: vertexAI.model("gemini-2.5-flash"),
          prompt: JSON.stringify({
            track: trackInfo,
            targetLanguage: getLanguageName(language),
          }),
          config: {
            temperature: 0.3,
            googleSearchRetrieval: {},
          },
        });

        for await (const chunk of stream) {
          sendChunk(chunk.text);
        }

        const result = (await response).text;
        return result;
      } catch (error) {
        if (error instanceof ValidationError) {
          logger.warn(`generateTrackOverviewFlow: ValidationError occurred.`, {
            error,
            trackInfo,
          });
        } else throw error;
      }
      retry++;
    }

    throw new KnownError(ERROR_CODES.AI_GENERATION_FAILED);
  }
);
