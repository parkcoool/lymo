import { z } from "zod";

/**
 * 곡 메타데이터 업데이트 이벤트
 */
export const MetadataUpdateEventSchema = z.object({
  event: z.literal("metadata_update"),
  data: z.object({
    id: z.string(),
    title: z.string(),
    artist: z.string(),
    album: z.string().nullable(),
    coverUrl: z.string(),
    publishedAt: z.string().nullable(),
    lyricsProvider: z.string(),
  }),
});
export type MetadataUpdateEvent = z.infer<typeof MetadataUpdateEventSchema>;

/**
 * 가사 문장 설정 이벤트
 */
export const LyricsSetEventSchema = z.object({
  event: z.literal("lyrics_set"),
  data: z.object({
    paragraphIndex: z.number(),
    sentenceIndex: z.number(),
    text: z.string(),
    start: z.number().nonnegative(),
    end: z.number().nonnegative(),
  }),
});
export type LyricsSetEvent = z.infer<typeof LyricsSetEventSchema>;

/**
 * 가사 문장 번역 설정 이벤트
 */
export const TranslationSetEventSchema = z.object({
  event: z.literal("translation_set"),
  data: z.object({
    paragraphIndex: z.number(),
    sentenceIndex: z.number(),
    text: z.string(),
  }),
});
export type TranslationSetEvent = z.infer<typeof TranslationSetEventSchema>;

/**
 * 곡 요약 설정 이벤트
 */
export const SummaryAppendEventSchema = z.object({
  event: z.literal("summary_append"),
  data: z.object({
    summary: z.string(),
  }),
});
export type SummaryAppendEvent = z.infer<typeof SummaryAppendEventSchema>;

/**
 * 문단 요약 이어쓰기 이벤트
 */
export const ParagraphSummaryAppendEventSchema = z.object({
  event: z.literal("paragraph_summary_append"),
  data: z.object({
    paragraphIndex: z.number(),
    summary: z.string(),
  }),
});
export type ParagraphSummaryAppendEvent = z.infer<
  typeof ParagraphSummaryAppendEventSchema
>;

/**
 * 스트리밍 완료 이벤트
 */
export const CompleteEventSchema = z.object({
  event: z.literal("complete"),
  data: z.null(),
});
