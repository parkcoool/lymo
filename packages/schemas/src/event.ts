import { z } from "zod";

import { LyricsDocSchema, ProviderDocSchema, TrackDetailDocSchema, TrackDocSchema } from "./doc";
import { LyricsProviderSchema } from "./shared";

/**
 * track update 이벤트
 */
export const UpdateTrackEventSchema = z.object({
  event: z.literal("update_track"),
  data: z.object({
    track: TrackDocSchema,
    trackId: z.string(),
  }),
});

/**
 * lyrics update 이벤트
 */
export const UpdateLyricsEventSchema = z.object({
  event: z.literal("update_lyrics"),
  data: z.object({
    lyrics: LyricsDocSchema.shape["lyrics"],
    lyricsProvider: LyricsProviderSchema,
  }),
});

/**
 * provider update 이벤트
 */
export const UpdateProviderEventSchema = z.object({
  event: z.literal("update_provider"),
  data: z.object({
    provider: ProviderDocSchema,
    providerId: z.string(),
  }),
});

// =============== trackDetail 관련 이벤트 ===============

/**
 * trackDetail update 이벤트
 */
export const UpdateTrackDetailEventSchema = z.object({
  event: z.literal("update_track_detail"),
  data: TrackDetailDocSchema,
});

/**
 * summary append 이벤트
 */
export const AppendSummaryEventSchema = z.object({
  event: z.literal("append_summary"),
  data: z.object({
    summary: z.string(),
  }),
});

/**
 * lyricsSplitIndices update 이벤트
 */
export const UpdateLyricsSplitIndicesEventSchema = z.object({
  event: z.literal("update_lyrics_split_indices"),
  data: z.object({
    lyricsSplitIndices: z.array(z.number()),
  }),
});

/**
 * translation update 이벤트
 */
export const UpdateTranslationEventSchema = z.object({
  event: z.literal("update_translation"),
  data: z.object({
    sentenceIndex: z.number(),
    translation: z.string().nullable(),
  }),
});

/**
 * paragraphSummary append 이벤트
 */
export const AppendParagraphSummaryEventSchema = z.object({
  event: z.literal("append_paragraph_summary"),
  data: z.object({
    paragraphIndex: z.number(),
    paragraphSummary: z.string(),
  }),
});

/**
 * paragraphSummary update 이벤트
 */
export const UpdateParagraphSummaryEventSchema = z.object({
  event: z.literal("update_paragraph_summary"),
  data: z.object({
    paragraphIndex: z.number(),
    paragraphSummary: z.string().nullable(),
  }),
});

export const CompleteEventSchema = z.object({
  event: z.literal("complete"),
  data: z.null(),
});
