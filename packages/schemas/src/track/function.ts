import { z } from "zod";

import { LyricsDocSchema, TrackDocSchema } from "./doc";
import {
  CompleteEventSchema,
  LyricsGroupEventSchema,
  LyricsProviderSetEventSchema,
  ParagraphSummaryAppendEventSchema,
  ProviderSetEventSchema,
  SummaryAppendEventSchema,
  TranslationSetEventSchema,
} from "./event";
import { LanguageSchema, LLMModelSchema, LyricsProviderSchema } from "./shared";

/**
 * addTrackFlow 입력
 */
export const AddTrackFlowInputSchema = z.object({
  title: z.string(),
  artist: z.string(),
  duration: z.number().positive(),
});
export type AddTrackFlowInput = z.infer<typeof AddTrackFlowInputSchema>;

/**
 * addTrackFlow 출력
 */
export const AddTrackFlowOutputSchema = z.union([
  z.object({
    id: z.string(),
    track: TrackDocSchema,
    lyrics: LyricsDocSchema.shape.lyrics,
    lyricsProvider: LyricsProviderSchema,
    notFound: z.literal(false),
  }),

  z.object({
    id: z.undefined(),
    track: z.undefined(),
    lyrics: z.undefined(),
    lyricsProvider: z.undefined(),
    notFound: z.literal(true),
  }),
]);
export type AddTrackFlowOutput = z.infer<typeof AddTrackFlowOutputSchema>;

/**
 * generateDetailFlow 입력
 */
export const GenerateDetailFlowInputSchema = z.object({
  id: z.string(),
  language: LanguageSchema,
  lyricsProvider: LyricsProviderSchema.optional(),
  model: LLMModelSchema.optional(),
});
export type GenerateDetailFlowInput = z.infer<typeof GenerateDetailFlowInputSchema>;

/**
 * generateDetailFlow 스트림
 */
export const GenerateDetailFlowStreamSchema = z.discriminatedUnion("event", [
  LyricsProviderSetEventSchema,
  TranslationSetEventSchema,
  LyricsGroupEventSchema,
  SummaryAppendEventSchema,
  ParagraphSummaryAppendEventSchema,
  ProviderSetEventSchema,
  CompleteEventSchema,
]);
export type GenerateDetailFlowStream = z.infer<typeof GenerateDetailFlowStreamSchema>;

/**
 * generateDetailFlow 출력
 */
export const GenerateDetailFlowOutputSchema = z.union([
  z.object({
    providerId: z.string(),
    success: z.literal(true),
    exists: z.literal(true),
  }),

  z.object({
    providerId: z.undefined(),
    success: z.literal(true),
    exists: z.literal(false),
  }),

  z.object({
    providerId: z.undefined(),
    success: z.literal(false),
    exists: z.literal(false),
  }),
]);
export type GenerateDetailFlowOutput = z.infer<typeof GenerateDetailFlowOutputSchema>;
