import { z } from "zod";

const MetadataUpdateSchema = z.object({
  event: z.literal("metadata_update"),
  data: z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string().nullable(),
    coverUrl: z.string(),
    publishedAt: z.string().nullable(),
    lyricsProvider: z.string(),
  }),
});

export const LyricsSetSchema = z.object({
  event: z.literal("lyrics_set"),
  data: z.object({
    paragraphIndex: z.number(),
    sentenceIndex: z.number(),
    text: z.string(),
  }),
});

export const TranslationSetSchema = z.object({
  event: z.literal("translation_set"),
  data: z.object({
    paragraphIndex: z.number(),
    sentenceIndex: z.number(),
    text: z.string(),
  }),
});

export const SummaryAppendSchema = z.object({
  event: z.literal("summary_append"),
  data: z.object({
    summary: z.string(),
  }),
});

export const ParagraphSummaryAppendSchema = z.object({
  event: z.literal("paragraph_summary_append"),
  data: z.object({
    paragraphIndex: z.number(),
    summary: z.string(),
  }),
});

export const StreamEndSchema = z.object({
  event: z.literal("stream_end"),
  data: z.object({}),
});

export const AddSongStreamSchema = z.discriminatedUnion("event", [
  MetadataUpdateSchema,
  SummaryAppendSchema,
  LyricsSetSchema,
  TranslationSetSchema,
  ParagraphSummaryAppendSchema,
  StreamEndSchema,
]);

export type AddSongStream = z.infer<typeof AddSongStreamSchema>;
