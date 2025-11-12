import { z } from "zod";

/**
 * 가사 문장
 */
export const LyricsSentenceSchema = z.object({
  text: z.string().min(1),
  translation: z.string().min(1).nullable(),
  start: z.number().nonnegative(),
  end: z.number().nonnegative(),
});
export type LyricsSentence = z.infer<typeof LyricsSentenceSchema>;

/**
 * 여러 가사 문장들로 구성된 문단
 */
export const LyricsParagraphSchema = z.object({
  sentences: z.array(LyricsSentenceSchema),
  summary: z.string().nullable(),
});
export type LyricsParagraph = z.infer<typeof LyricsParagraphSchema>;

/**
 * 여러 문단으로 구성된 가사
 */
export const LyricsSchema = z.array(LyricsParagraphSchema);
export type Lyrics = z.infer<typeof LyricsSchema>;

/**
 * 곡 정보
 */
export const TrackSchema = z.object({
  id: z.string().min(1),
  album: z.string().min(1).nullable(),
  artist: z.string().min(1),
  coverUrl: z.string(),
  duration: z.number().positive(),
  publishedAt: z.string().nullable(),
  title: z.string().min(1),
});
export type Track = z.infer<typeof TrackSchema>;

/**
 * 곡 상세 정보
 */
export const TrackDetailSchema = z.object({
  lyrics: LyricsSchema,
  lyricsProvider: z.string(),
  summary: z.string(),
});
export type TrackDetail = z.infer<typeof TrackDetailSchema>;

/**
 * 언어
 */
export const LanguageSchema = z.enum(["en", "ko"]);
export type Language = z.infer<typeof LanguageSchema>;

/**
 * 가사 제공자
 */
export const LyricsProviderSchema = z.enum(["lrclib", "none"]);
export type LyricsProvider = z.infer<typeof LyricsProviderSchema>;
