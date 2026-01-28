import { Track, TrackSchema } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { z } from "genkit";

import { ai } from "@/config";

const InputSchema = z.object({
  track: TrackSchema,
  trackId: z.string(),
});

const OutputSchema = z.void();

export const createTrackDoc = ai.defineTool(
  {
    name: "createTrackDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Create a track document in DB",
  },
  async ({ track, trackId }) => {
    // trackId 전달 시
    const trackRequestRef = admin
      .firestore()
      .collection("tracks")
      .doc(trackId) as DocumentReference<Track>;

    await trackRequestRef.set(track);
  }
);
