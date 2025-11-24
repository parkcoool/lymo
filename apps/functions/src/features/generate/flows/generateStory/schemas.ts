import { GeneratedStoryFieldsSchema, TrackSchema } from "@lymo/schemas/doc";
import { LanguageSchema, LyricsProviderSchema } from "@lymo/schemas/shared";
import { z } from "genkit";

export const InputSchema = z.object({
  track: TrackSchema,
  config: z.object({
    lyricsProvider: LyricsProviderSchema,
    language: LanguageSchema,
  }),
});

export const StreamSchema = GeneratedStoryFieldsSchema.partial();

export const OutputSchema = GeneratedStoryFieldsSchema;
