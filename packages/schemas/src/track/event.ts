import { z } from "zod";

/**
 * 가사 문장 번역 설정 이벤트
 */
export const TranslationSetEventSchema = z.object({
  event: z.literal("translation_set"),
  data: z.object({
    sentenceIndex: z.number(),
    text: z.string(),
  }),
});
export type TranslationSetEvent = z.infer<typeof TranslationSetEventSchema>;

/**
 * 가사 문단 구분 이벤트
 */
export const LyricsGroupEventSchema = z.object({
  event: z.literal("lyrics_group"),
  data: z.array(z.number()),
});
export type LyricsGroupEvent = z.infer<typeof LyricsGroupEventSchema>;

/**
 * 곡 요약 append 이벤트
 */
export const SummaryAppendEventSchema = z.object({
  event: z.literal("summary_append"),
  data: z.object({
    summary: z.string(),
  }),
});
export type SummaryAppendEvent = z.infer<typeof SummaryAppendEventSchema>;

/**
 * 문단 요약 append 이벤트
 */
export const ParagraphSummaryAppendEventSchema = z.object({
  event: z.literal("paragraph_summary_append"),
  data: z.object({
    paragraphIndex: z.number(),
    summary: z.string(),
  }),
});
export type ParagraphSummaryAppendEvent = z.infer<typeof ParagraphSummaryAppendEventSchema>;

/**
 * 스트리밍 완료 이벤트
 */
export const CompleteEventSchema = z.object({
  event: z.literal("complete"),
  data: z.null(),
});
