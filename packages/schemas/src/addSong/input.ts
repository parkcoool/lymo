import { z } from "genkit";

export const AddSongInputSchema = z.object({
  title: z.string().min(1).max(100),
  artist: z.string().min(1).max(100),
  duration: z.number().positive(),
});
