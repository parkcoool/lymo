import { z } from "zod";

import { TrackSchema } from "./doc";
import { errorCode } from "./error";
import { LanguageSchema } from "./shared";

// ==============================
// 공통 스키마
// ==============================
const CommonOutputSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.union([
    z.object({
      success: z.literal(true),
      data: schema,
    }),

    z.object({
      success: z.literal(false),
      error: errorCode,
      message: z.string().optional(),
    }),
  ]);

// ==============================
// retrieveTrack 관련 스키마
// ==============================
export const RetrieveTrackInputSchema = z.union([
  z.object({
    trackId: z.string(),
  }),

  z.object({
    title: z.string(),
    artist: z.string(),
    durationInSeconds: z.number(),
  }),
]);
export type RetrieveTrackInput = z.infer<typeof RetrieveTrackInputSchema>;

export const RetrieveTrackOutputSchema = CommonOutputSchema(
  z.object({
    id: z.string(),
    data: TrackSchema,
  })
);
export type RetrieveTrackOutput = z.infer<typeof RetrieveTrackOutputSchema>;

// ==============================
// retrieveTrackNoti 관련 스키마
// ==============================
export const RetrieveTrackNotiInputSchema = z.object({
  title: z.string(),
  artist: z.string(),
  durationInSeconds: z.number(),
  language: LanguageSchema,
  datetime: z.string().optional(),
  weather: z.string().optional(),
});
export type RetrieveTrackNotiInput = z.infer<typeof RetrieveTrackNotiInputSchema>;

export const RetrieveTrackNotiOutputSchema = CommonOutputSchema(z.string().nullable());
export type RetrieveTrackNotiOutput = z.infer<typeof RetrieveTrackNotiOutputSchema>;
