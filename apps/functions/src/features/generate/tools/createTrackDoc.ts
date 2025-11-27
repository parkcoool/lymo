import { Track, TrackPreview, TrackSchema } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

const InputSchema = z.object({
  track: TrackSchema,
  trackId: z.string().optional(),
  requestId: z.string().optional(),
});

const OutputSchema = z.void();

export const createTrackDoc = ai.defineTool(
  {
    name: "createTrackDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Create a track document in DB",
  },
  async ({ track, trackId, requestId }) => {
    // trackId 전달 시
    let trackRef: DocumentReference<Track> | null = null;
    if (trackId) {
      const trackCollectionRef = admin
        .firestore()
        .collection("tracks") as CollectionReference<Track>;
      trackRef = trackCollectionRef.doc(trackId);
    }

    // requestId 전달 시
    let trackPreviewRef: DocumentReference<Track> | null = null;
    if (requestId) {
      const TrackPreviewCollectionRef = admin
        .firestore()
        .collection("trackRequests")
        .doc(requestId)
        .collection("previews");
      trackPreviewRef = TrackPreviewCollectionRef.doc("track") as DocumentReference<TrackPreview>;
    }

    await Promise.all([
      trackRef ? trackRef.create(track) : null,
      trackPreviewRef ? trackPreviewRef.set(track) : null,
    ]);
  }
);
