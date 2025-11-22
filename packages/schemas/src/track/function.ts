import { z } from "zod";

import {
  TrackSetEventSchema,
  CompleteEventSchema,
  LyricsGroupEventSchema,
  LyricsProviderSetEventSchema,
  LyricsSetEventSchema,
  ParagraphSummaryAppendEventSchema,
  ProviderSetEventSchema,
  SummaryAppendEventSchema,
  TranslationSetEventSchema,
} from "./event";
import { LanguageSchema, LLMModelSchema } from "./shared";

// =============== 공통 스키마 ===============

const CommonGetTrackFlowInputSchema = z.object({
  language: LanguageSchema,
  model: LLMModelSchema,
});

export const CommonGetTrackFlowStreamSchema = z.discriminatedUnion("event", [
  TrackSetEventSchema,
  LyricsSetEventSchema,
  SummaryAppendEventSchema,
  ParagraphSummaryAppendEventSchema,
  ProviderSetEventSchema,
  LyricsProviderSetEventSchema,
  TranslationSetEventSchema,
  LyricsGroupEventSchema,
  CompleteEventSchema,
]);
export type CommonGetTrackFlowStream = z.infer<typeof CommonGetTrackFlowStreamSchema>;

const CommonGetTrackFlowOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

// =============== getTrackFromId 스키마 ===============
export const GetTrackFromIdFlowInputSchema = CommonGetTrackFlowInputSchema.extend({
  trackId: z.string(),
});
export type GetTrackFromIdFlowInput = z.infer<typeof GetTrackFromIdFlowInputSchema>;

export const GetTrackFromIdFlowStreamSchema = CommonGetTrackFlowStreamSchema;
export type GetTrackFromIdFlowStream = z.infer<typeof GetTrackFromIdFlowStreamSchema>;

export const GetTrackFromIdFlowOutputSchema = CommonGetTrackFlowOutputSchema;
export type GetTrackFromIdFlowOutput = z.infer<typeof GetTrackFromIdFlowOutputSchema>;

// =============== getTrackFromMetadata 스키마 ===============
export const GetTrackFromMetadataFlowInputSchema = CommonGetTrackFlowInputSchema.extend({
  trackMetadata: z.object({
    title: z.string(),
    artist: z.string(),
    durationInSeconds: z.number(),
  }),
});
export type GetTrackFromMetadataFlowInput = z.infer<typeof GetTrackFromMetadataFlowInputSchema>;

export const GetTrackFromMetadataFlowStreamSchema = CommonGetTrackFlowStreamSchema;
export type GetTrackFromMetadataFlowStream = z.infer<typeof GetTrackFromMetadataFlowStreamSchema>;

export const GetTrackFromMetadataFlowOutputSchema = CommonGetTrackFlowOutputSchema;
export type GetTrackFromMetadataFlowOutput = z.infer<typeof GetTrackFromMetadataFlowOutputSchema>;
