import { z } from "zod";

import { LyricsProviderSchema } from "./shared";

/**
 * Track 문서
 *
 * 문서 경로: `tracks/{trackId}`
 */
export const TrackDocSchema = z.object({
  album: z.string().nullable(),
  artist: z.array(z.string()),
  coverUrl: z.string(),
  duration: z.number(),
  publishedAt: z.string().nullable(),
  title: z.string(),
  createdAt: z.string(),
  lyricsProviders: z.array(LyricsProviderSchema),
  play: z.number(),
});
export type TrackDoc = z.infer<typeof TrackDocSchema>;

/**
 * Track 가사 문서
 *
 * 문서 경로: `tracks/{trackId}/lyrics/{lyricsProvider}`
 */
export const LyricsDocSchema = z.object({
  lyrics: z.array(
    z.object({
      text: z.string(),
      start: z.number(),
      end: z.number(),
    })
  ),
});
export type LyricsDoc = z.infer<typeof LyricsDocSchema>;

/**
 * 제공자 문서
 *
 * 문서 경로: `tracks/{trackId}/providers/{providerId}`
 */
export const ProviderDocSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  providerName: z.string(),
});
export type ProviderDoc = z.infer<typeof ProviderDocSchema>;

/**
 * Track 상세 문서
 *
 * 문서 경로: `tracks/{trackId}/providers/{providerId}/details/{language}`
 */
export const TrackDetailDocSchema = z.object({
  summary: z.string(),
  lyricsSplitIndices: z.array(z.number()),
  lyricsProvider: LyricsProviderSchema,
  translations: z.array(z.string().nullable()),
  paragraphSummaries: z.array(z.string().nullable()),
});
export type TrackDetailDoc = z.infer<typeof TrackDetailDocSchema>;
