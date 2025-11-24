import { Track } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

const InputSchema = z.object({
  trackId: z.string(),
});

const OutputSchema = Track.nullable();

export const getTrackDoc = ai.defineTool(
  {
    name: "getTrackDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Retrieve a track document from DB using its track ID",
  },
  async ({ trackId }) => {
    const trackDocRef = admin
      .firestore()
      .collection("tracks")
      .doc(trackId) as DocumentReference<Track>;
    const track = (await trackDocRef.get()).data();

    return track ?? null;
  }
);
