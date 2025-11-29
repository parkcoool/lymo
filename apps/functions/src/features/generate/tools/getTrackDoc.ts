import { Track, TrackSchema } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

const InputSchema = z.union([
  z.object({
    trackId: z.string(),
  }),

  z.object({
    title: z.string(),
    artist: z.string(),
    durationInSeconds: z.number(),
  }),
]);

export const OutputSchema = z
  .object({
    id: z.string(),
    data: TrackSchema,
  })
  .nullable();

export const getTrackDoc = ai.defineTool(
  {
    name: "getTrackDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Retrieve a track document from DB using its track ID",
  },
  async (input) => {
    // 1) trackId를 전달한 경우
    if ("trackId" in input) {
      const trackDocRef = admin
        .firestore()
        .collection("tracks")
        .doc(input.trackId) as DocumentReference<Track>;

      const trackSnap = await trackDocRef.get();
      const track = trackSnap.data();
      if (trackSnap.exists && track) return { id: trackSnap.id, data: track };
    }

    // 2) title, artist, durationInSeconds를 전달한 경우
    else {
      const trackCollectionRef = admin
        .firestore()
        .collection("tracks") as CollectionReference<Track>;
      const q = trackCollectionRef
        .where("title", "==", input.title)
        .where("artist", "==", input.artist)
        .where("durationInSeconds", "==", input.durationInSeconds)
        .limit(1);

      const trackSnap = (await q.get()).docs[0];
      if (trackSnap?.exists) return { id: trackSnap.id, data: trackSnap.data() };
    }

    return null;
  }
);
