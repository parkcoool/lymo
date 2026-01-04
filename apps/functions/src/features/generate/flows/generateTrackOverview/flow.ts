import { vertexAI } from "@genkit-ai/google-genai";

import ai from "@/core/genkit";
import getLanguageName from "@/features/shared/utils/getLanguageName";

import { InputSchema, StreamSchema, OutputSchema } from "./schemas";

export const generateTrackOverviewFlow = ai.defineFlow(
  {
    name: "generateTrackOverviewFlow",
    inputSchema: InputSchema,
    streamSchema: StreamSchema,
    outputSchema: OutputSchema,
  },
  async ({ trackInfo, config: { language } }, { sendChunk }) => {
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
  }
);
