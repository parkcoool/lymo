import { LanguageSchema } from "@lymo/schemas/shared";
import { z } from "genkit";

export const InputSchema = z.object({
  trackInfo: z.object({
    title: z.string().describe("The title of the song"),
    artists: z.string().array().describe("The artists of the song"),
    album: z.string().nullable().describe("The album of the song"),
  }),
  lyrics: z
    .array(z.string().describe("A sentence from the lyrics"))
    .describe("The lyrics of the song"),
  config: z.object({
    language: LanguageSchema.describe("The language for the summary"),
  }),
});

export const StreamSchema = z.string().describe("The summary append event");

export const OutputSchema = z.string().describe("A chunk of the summary for the song");
