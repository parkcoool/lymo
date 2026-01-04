import { z } from "zod";

import {
  LanguageSchema,
  LyricSchema,
  LyricsProvider,
  LyricsProviderSchema,
  ReactionEmojiSchema,
  WordNoteSchema,
} from "./shared";

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
    favoriteCount: z.number(),
    viewCount: z.number(),
  }),
  storyCount: z.number(),

  scores: z
    .object({
      trivia: z.number(),
      depth: z.number(),
      impact: z.number(),
    })
    .optional(),
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
  wordNotes: WordNoteSchema.array().optional(),
});
export type GeneratedStoryFields = z.infer<typeof GeneratedStoryFieldsSchema>;

// `stories/{storyId}` 문서 스키마
export const StorySchema = BaseStoryFieldsSchema.merge(TrackInfoFieldsSchema).merge(
  GeneratedStoryFieldsSchema
);
export type Story = z.infer<typeof StorySchema>;

// `stories/{storyId}/favorites/{userId}` 문서 스키마
export const FavoriteSchema = z.object({
  createdAt: z.string(),
});
export type Favorite = z.infer<typeof FavoriteSchema>;

// `stories/{storyId}/reactions` 공통 필드
export const BaseReactionFieldsSchema = z.object({
  userId: z.string(),
  createdAt: z.string(),
  timestampInSeconds: z.number(),
});

// `stories/{storyId}/reactions` 문서 스키마
export const ReactionSchema = z.union([
  BaseReactionFieldsSchema.extend({
    type: z.literal("emoji"),
    content: ReactionEmojiSchema,
  }),

  BaseReactionFieldsSchema.extend({
    type: z.literal("comment"),
    content: z.string(),
  }),
]);
export type Reaction = z.infer<typeof ReactionSchema>;

// `stories/{storyId}/buckets/{bucketId}` 문서 스키마
export const BucketSchema = z.object({
  start: z.number(),
  end: z.number(),
  counts: z.record(z.union([ReactionEmojiSchema, z.literal("comment")]), z.number()),
});
export type Bucket = z.infer<typeof BucketSchema>;

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
