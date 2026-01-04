import { LanguageSchema } from "@lymo/schemas/shared";
import { z } from "genkit";

export const InputSchema = z.object({
  trackInfo: z.object({
    title: z.string().describe("The title of the song"),
    artists: z.string().array().describe("The artists of the song"),
    album: z.string().nullable().describe("The album of the song"),
  }),
  lyrics: z
    .array(
      z.array(z.string().describe("A sentence in the lyrics")).describe("A section in the lyrics")
    )
    .describe("The lyrics of the song, organized by sections"),
  config: z.object({
    language: LanguageSchema.describe("The target language of the summaries"),
  }),
});

export const StreamSchema = z.union([
  z.object({
    type: z.literal("append"),
    text: z.string().describe("The appended text to the current section summary"),
    sectionIndex: z.number().describe("The index of the section being summarized"),
  }),

  z.object({
    type: z.literal("update"),
    text: z.string().nullable().describe("The updated full text of the current section summary"),
    sectionIndex: z.number().describe("The index of the section being summarized"),
  }),
]);

export const OutputSchema = z
  .string()
  .nullable()
  .describe("The summarized text of the section")
  .array();
