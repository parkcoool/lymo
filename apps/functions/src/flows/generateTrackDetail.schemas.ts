import { LyricsDocSchema, ProviderDocSchema, TrackDetailDocSchema } from "@lymo/schemas/doc";
import {
  AppendSummaryEventSchema,
  UpdateLyricsSplitIndicesEventSchema,
  UpdateTranslationEventSchema,
  AppendParagraphSummaryEventSchema,
  UpdateParagraphSummaryEventSchema,
} from "@lymo/schemas/event";
import { LanguageSchema, LLMModelSchema, LyricsProviderSchema } from "@lymo/schemas/shared";
import { z } from "genkit";

export const GenerateTrackDetailFlowInputSchema = z.object({
  track: z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string().nullable(),
    trackId: z.string(),
  }),
  lyrics: z.object({
    lyricsProvider: LyricsProviderSchema,
    lyrics: LyricsDocSchema.shape["lyrics"],
  }),
  config: z.object({
    language: LanguageSchema,
    model: LLMModelSchema,
  }),
});

export const GenerateTrackDetailFlowStreamSchema = z.discriminatedUnion("event", [
  AppendSummaryEventSchema,
  UpdateLyricsSplitIndicesEventSchema,
  UpdateTranslationEventSchema,
  AppendParagraphSummaryEventSchema,
  UpdateParagraphSummaryEventSchema,
]);

export const GenerateTrackDetailFlowOutputSchema = z.object({
  trackDetail: TrackDetailDocSchema,
  provider: ProviderDocSchema,
});
