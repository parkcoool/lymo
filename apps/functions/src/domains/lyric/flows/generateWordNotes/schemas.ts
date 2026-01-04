import { LanguageSchema } from "@lymo/schemas/shared";
import { z } from "genkit";

export const InputSchema = z.object({
  trackInfo: z.object({
    title: z.string().describe("The title of the song"),
    artists: z.string().array().describe("The artists of the song"),
    album: z.string().nullable().describe("The album of the song"),
  }),
  lyrics: z.string().describe("A sentence in the lyrics").array(),
  config: z.object({
    language: LanguageSchema.describe("The target language of the summaries"),
  }),
});

export const OutputSchema = z
  .object({
    lyricIndex: z.number().describe("The index of the lyric section"),
    word: z.string().describe("The word to be noted"),
    note: z.string().describe("The note for the word"),
  })
  .array();
