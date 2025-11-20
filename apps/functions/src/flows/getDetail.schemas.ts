import { LyricsDocSchema, TrackDetailDocSchema } from "@lymo/schemas/doc";
import {
  CompleteEventSchema,
  LyricsGroupEventSchema,
  ParagraphSummaryAppendEventSchema,
  SummaryAppendEventSchema,
  TranslationSetEventSchema,
} from "@lymo/schemas/event";
import { LanguageSchema, LLMModelSchema, LyricsProviderSchema } from "@lymo/schemas/shared";
import { z } from "genkit";

export const GetDetailFlowInputSchema = z.object({
  metadata: z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string(),
  }),
  lyricsProvider: LyricsProviderSchema,
  lyrics: LyricsDocSchema.shape["lyrics"],
  trackId: z.string(),
  language: LanguageSchema,
  model: LLMModelSchema,
});

export const GetDetailFlowStreamSchema = z.discriminatedUnion("event", [
  CompleteEventSchema,
  LyricsGroupEventSchema,
  ParagraphSummaryAppendEventSchema,
  SummaryAppendEventSchema,
  TranslationSetEventSchema,
]);

export const GetDetailFlowOutputSchema = TrackDetailDocSchema;
