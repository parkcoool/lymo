import { Track, TrackSchema } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

import { getRetrieveTrackCacheDoc } from "./getRetrieveTrackCacheDoc";

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
    description: "Retrieve a track document from DB using its track ID or cached track ID",
  },
  async (input) => {
    let trackId: string | null = null;

    if ("title" in input && "artist" in input && "durationInSeconds" in input) {
      trackId = await getRetrieveTrackCacheDoc(input);
    } else {
      trackId = input.trackId;
    }

    if (!trackId) return null;

    const trackDocRef = admin
      .firestore()
      .collection("tracks")
      .doc(trackId) as DocumentReference<Track>;

    const trackSnap = await trackDocRef.get();
    const track = trackSnap.data();
    if (trackSnap.exists && track) return { id: trackSnap.id, data: track };
    return null;
  }
);
