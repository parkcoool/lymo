import { z } from "zod";

import {
  MetadataUpdateEventSchema,
  SummaryAppendEventSchema,
  LyricsUpdateEventSchema,
  TranslationSetEventSchema,
  ParagraphSummaryAppendEventSchema,
  CompleteEventSchema,
  LyricsGroupEventSchema,
} from "./event";

/**
 * addTrackFlow 입력
 */
export const AddTrackFlowInputSchema = z.object({
  title: z.string().min(1),
  artist: z.string().min(1),
  duration: z.number().positive(),
});
export type AddTrackFlowInput = z.infer<typeof AddTrackFlowInputSchema>;

/**
 * addTrackFlow 스트림
 */
export const AddTrackFlowStreamSchema = z.discriminatedUnion("event", [
  MetadataUpdateEventSchema,
  SummaryAppendEventSchema,
  LyricsUpdateEventSchema,
  TranslationSetEventSchema,
  LyricsGroupEventSchema,
  ParagraphSummaryAppendEventSchema,
  CompleteEventSchema,
]);
export type AddTrackFlowStream = z.infer<typeof AddTrackFlowStreamSchema>;

/**
 * addTrackFlow 출력
 */
export const AddTrackFlowOutputSchema = z.object({
  id: z.string().min(1).optional(),
  duplicate: z.boolean().optional(),
  notFound: z.boolean().optional(),
});
export type AddTrackFlowOutput = z.infer<typeof AddTrackFlowOutputSchema>;
