import { LanguageSchema } from "@lymo/schemas/shared";
import { z } from "genkit";

export const InputSchema = z.object({
  lyrics: z
    .array(
      z.object({
        start: z.number().describe("The start time of the sentence in seconds"),
        end: z.number().describe("The end time of the sentence in seconds"),
        text: z.string().describe("The text of the sentence"),
      })
    )
    .describe("The lyrics of the song"),

  config: z.object({
    language: LanguageSchema.describe("The target language for translation"),
  }),
});

export const StreamSchema = z.object({
  sentenceIndex: z.number().describe("The index of the translated sentence"),
  translation: z.string().nullable().describe("The translated text of the sentence"),
});

export const OutputSchema = z.array(
  z.string().nullable().describe("The translated text of the sentence")
);
