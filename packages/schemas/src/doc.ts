import { z } from "zod";

import { LanguageSchema, LyricSchema, LyricsProvider, LyricsProviderSchema } from "./shared";

// ==============================
// track 관련 스키마
// ==============================

// `tracks/{trackId}` 문서 스키마
export const TrackSchema = z.object({
  title: z.string(),
  artists: z.string().array(),
  album: z.string().nullable(),
  albumArt: z.string(),
  durationInSeconds: z.number(),
  publishedAt: z.string().nullable(),
  lyrics: z.record(LyricsProviderSchema, LyricSchema.array().optional()),

  createdAt: z.string(),
  stats: z.object({
    storyCount: z.number(),
    viewCount: z.number(),
  }),
});
export type Track = Omit<z.infer<typeof TrackSchema>, "lyrics"> & {
  lyrics: Partial<Record<LyricsProvider, z.infer<typeof LyricSchema>[]>>;
};

// ==============================
// story 관련 스키마
// ==============================

// 공통 필드
export const BaseStoryFieldsSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().nullable(),

  language: LanguageSchema,
  lyricsProvider: LyricsProviderSchema,

  updatedAt: z.string(),
  stats: z.object({
    favoriteCount: z.number(),
    viewCount: z.number(),
  }),
});
export type BaseStoryFields = z.infer<typeof BaseStoryFieldsSchema>;

// track 정보 필드
export const TrackInfoFieldsSchema = z.object({
  trackId: z.string(),
  trackTitle: z.string(),
  trackArtists: z.string().array(),
  trackAlbum: z.string().nullable(),
  trackAlbumArt: z.string(),
});
export type TrackInfoFields = z.infer<typeof TrackInfoFieldsSchema>;

// AI 생성 필드
export const GeneratedStoryFieldsSchema = z.object({
  overview: z.string(),
  sectionBreaks: z.number().array(),
  lyricTranslations: z.string().nullable().array(),
  sectionNotes: z.string().nullable().array(),
});
export type GeneratedStoryFields = z.infer<typeof GeneratedStoryFieldsSchema>;

// `stories/{storyId}` 문서 스키마
export const StorySchema = BaseStoryFieldsSchema.merge(TrackInfoFieldsSchema).merge(
  GeneratedStoryFieldsSchema
);
export type Story = z.infer<typeof StorySchema>;

// ==============================
// retrieveTrackCache 관련 스키마
// ==============================

export const RetrieveTrackCacheSchema = z.object({
  trackId: z.string(),
  title: z.string(),
  artist: z.string(),
  durationInSeconds: z.number(),
  createdAt: z.string(),
});
export type RetrieveTrackCache = z.infer<typeof RetrieveTrackCacheSchema>;
