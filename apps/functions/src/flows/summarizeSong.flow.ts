import { LanguageSchema } from "@lymo/schemas/shared";
import { z } from "genkit";

import ai from "@/core/genkit";

export const SummarizeSongInputSchema = z.object({
  track: z.object({
    title: z.string().describe("The title of the song"),
    artist: z.string().describe("The artist of the song"),
    album: z.string().nullable().describe("The album of the song"),
  }),
  lyrics: z
    .array(z.string().describe("A sentence from the lyrics"))
    .describe("The lyrics of the song"),
  config: z.object({
    language: LanguageSchema.describe("The language for the summary"),
  }),
});

export const SummaryAppendEventSchema = z.string().describe("The summary append event");

export const SummarizeSongOutputSchema = z.string().describe("A chunk of the summary for the song");

export const summarizeSongFlow = ai.defineFlow(
  {
    name: "summarizeSongFlow",
    inputSchema: SummarizeSongInputSchema,
    streamSchema: SummaryAppendEventSchema,
    outputSchema: SummarizeSongOutputSchema,
  },
  async ({ track, lyrics, config: { language } }, { sendChunk }) => {
    const { stream, response } = ai.generateStream({
      system: `
        ### Role
        Based on the provided lyrics and metadata of a song, summarize the song's content.

        ### Goal
        - Include the song's theme, message, and core storyline.
        - Utilize web search to include the social context at the time of the song's release, its genre characteristics, and the artist's background.
        - May also include behind-the-scenes stories, production process, and public reception.

        ### Constraints
        - The summary must consist of 2 to 3 paragraphs.
        - Paragraphs must be separated by two newline characters.
        - The summary must be written in the given target language.
      `,
      prompt: JSON.stringify({ track, lyrics, targetLanguage: language }),
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
