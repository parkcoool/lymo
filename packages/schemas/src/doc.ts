import { z } from "zod";

import { errorCode } from "./error";
import { LanguageSchema, LyricSchema, LyricsProviderSchema } from "./shared";

// `tracks/{trackId}` 문서 스키마
export const Track = z.object({
  title: z.string(),
  artists: z.string().array(),
  album: z.string().nullable(),
  albumArt: z.string(),
  durationInSeconds: z.number(),
  publishedAt: z.string().nullable(),
  lyrics: z.record(LyricsProviderSchema, LyricSchema.array()),

  createdAt: z.string(),
  stats: z.object({
    storyCount: z.number(),
    viewCount: z.number(),
  }),
});
export type Track = z.infer<typeof Track>;

// #region `stories/{storyId}` 관련 스키마

// 공통 필드
export const BaseStoryFieldsSchema = z.object({
  trackId: z.string(),
  trackTitle: z.string(),
  trackArtists: z.string().array(),
  trackAlbum: z.string().nullable(),
  trackAlbumArt: z.string(),

  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().nullable(),
  language: LanguageSchema,

  stats: z.object({
    favoriteCount: z.number(),
    viewCount: z.number(),
  }),
});
export type BaseStoryFields = z.infer<typeof BaseStoryFieldsSchema>;

// AI 생성 필드
export const GeneratedStoryFieldsSchema = z.object({
  lyricsProvider: LyricsProviderSchema,
  overview: z.string(),
  sectionBreaks: z.number().array(),
  translations: z.string().nullable().array(),
  sectionNotes: z.string().nullable().array(),
});
export type GeneratedStoryFields = z.infer<typeof GeneratedStoryFieldsSchema>;

// `stories/{storyId}` 문서 스키마
export const StorySchema = z.union([
  // status가 PENDING일 경우
  BaseStoryFieldsSchema.extend({
    status: z.literal("PENDING"),
  }),

  // status가 IN_PROGRESS일 경우
  BaseStoryFieldsSchema.merge(GeneratedStoryFieldsSchema.partial()).extend({
    status: z.literal("IN_PROGRESS"),
  }),

  // status가 COMPLETED일 경우
  BaseStoryFieldsSchema.merge(GeneratedStoryFieldsSchema).extend({
    status: z.literal("COMPLETED"),
  }),

  // status가 FAILED일 경우
  BaseStoryFieldsSchema.extend({
    status: z.literal("FAILED"),
    errorCode: errorCode,
  }),
]);
export type Story = z.infer<typeof StorySchema>;

// #endregion
