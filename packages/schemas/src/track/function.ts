import { z } from "zod";

import { LyricsDocSchema, TrackDocSchema } from "./doc";

/**
 * addTrackFlow 입력
 */
export const AddTrackFlowInputSchema = z.object({
  title: z.string(),
  artist: z.string(),
  duration: z.number().positive(),
});
export type AddTrackFlowInput = z.infer<typeof AddTrackFlowInputSchema>;

/**
 * addTrackFlow 출력
 */
export const AddTrackFlowOutputSchema = z.union([
  z.object({
    id: z.string(),
    track: TrackDocSchema,
    lyrics: LyricsDocSchema.shape.lyrics,
    notFound: z.literal(false),
  }),

  z.object({
    id: z.undefined(),
    track: z.undefined(),
    lyrics: z.undefined(),
    notFound: z.literal(true),
  }),
]);
export type AddTrackFlowOutput = z.infer<typeof AddTrackFlowOutputSchema>;
