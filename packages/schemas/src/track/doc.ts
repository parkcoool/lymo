import { z } from "zod";

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
 * Track 상세 문서
 *
 * 문서 경로: `tracks/{trackId}/details/{providerId}/contents/{language}`
 */
export const TrackDetailDocSchema = z.union([
  z.object({
    summary: z.string(),
    lyricsSplitIndices: z.array(z.number()),
    lyricsProvider: z.string(),
    translations: z.array(z.string().nullable()),
    paragraphSummaries: z.array(z.string().nullable()),
  }),

  z.object({
    isPending: z.literal(true),
  }),
]);
export type TrackDetailDoc = z.infer<typeof TrackDetailDocSchema>;
