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
export const LyricsUpdateEventSchema = z.object({
  event: z.literal("lyrics_update"),
  data: z.array(
    z
      .object({
        start: z.number().describe("The start time of the sentence in seconds"),
        end: z.number().describe("The end time of the sentence in seconds"),
        text: z.string().describe("The text of the sentence"),
      })
      .describe("A sentence in the lyrics")
  ),
});
export type LyricsUpdateEvent = z.infer<typeof LyricsUpdateEventSchema>;

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
