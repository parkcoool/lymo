import { z } from "zod";

const MetadataUpdateSchema = z.object({
  event: z.literal("metadata_update"),
  data: z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string().nullable(),
    coverUrl: z.string(),
    publishedAt: z.string().nullable(),
    sourceProvider: z.string(),
    sourceId: z.string(),
    lyricsProvider: z.string(),
  }),
});

export const LyricsAddSchema = z.object({
  event: z.literal("lyrics_add"),
  data: z.object({
    paragraphIndex: z.number(),
    text: z.string(),
    start: z.number(),
    end: z.number(),
  }),
});

export const TranslationAppendSchema = z.object({
  event: z.literal("translation_append"),
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

const StreamEndSchema = z.object({
  event: z.literal("stream_end"),
  data: z.object({}),
});

export const AddSongInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
});

export const AddSongStreamSchema = z.discriminatedUnion("event", [
  MetadataUpdateSchema,
  SummaryAppendSchema,
  LyricsAddSchema,
  TranslationAppendSchema,
  ParagraphSummaryAppendSchema,
  StreamEndSchema,
]);

export const AddSongOutputSchema = z
  .string()
  .describe("The ID of the added song");

export type AddSongStream = z.infer<typeof AddSongStreamSchema>;
