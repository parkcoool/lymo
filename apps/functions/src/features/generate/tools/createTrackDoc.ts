import { Track, TrackSchema } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import admin from "firebase-admin";
import { CollectionReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

const InputSchema = z.object({
  trackDoc: TrackSchema,
  id: z.string(),
});

const OutputSchema = z.void();

export const createTrackDoc = ai.defineTool(
  {
    name: "createTrackDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Create a track document in DB",
  },
  async ({ trackDoc, id }) => {
    try {
      const trackCollectionRef = admin
        .firestore()
        .collection("tracks") as CollectionReference<Track>;
      const newTrackRef = trackCollectionRef.doc(id);

      await newTrackRef.create(trackDoc);
    } catch {
      throw new Error(ERROR_CODES.TRACK_SAVE_FAILED);
    }
  }
);
