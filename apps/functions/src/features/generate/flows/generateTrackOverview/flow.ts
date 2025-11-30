import ai from "@/core/genkit";

import { InputSchema, StreamSchema, OutputSchema } from "./schemas";

export const generateTrackOverviewFlow = ai.defineFlow(
  {
    name: "generateTrackOverviewFlow",
    inputSchema: InputSchema,
    streamSchema: StreamSchema,
    outputSchema: OutputSchema,
  },
  async ({ trackInfo, lyrics, config: { language } }, { sendChunk }) => {
    const { stream, response } = ai.generateStream({
      system: `
        ### Role
        Based on the provided lyrics and metadata of a song, summarize the song's content.

        ### Goal
        - Include the song's theme, message, and core storyline.
        - Utilize web search to include the social context at the time of the song's release, its genre characteristics, and the artist's background.
        - May also include behind-the-scenes stories, production process, and public reception.

        ### Constraints
        - The summary must consist of 2 to 3 sections.
        - Sections must be separated by two newline characters.
        - The summary must be written in the given target language.
      `,
      prompt: JSON.stringify({ track: trackInfo, lyrics, targetLanguage: language }),
      config: {
        temperature: 0.3,
      },
    });

    for await (const chunk of stream) {
      sendChunk(chunk.text);
    }

    const result = (await response).text;
    return result;
  }
);
