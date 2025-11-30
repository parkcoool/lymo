import { z } from "zod";

import { TrackSchema } from "./doc";
import { errorCode } from "./error";

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
