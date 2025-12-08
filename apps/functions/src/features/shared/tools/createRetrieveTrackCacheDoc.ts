import { RetrieveTrackCache } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { DocumentReference, FieldValue } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

const InputSchema = z.object({
  trackId: z.string(),
  title: z.string(),
  artist: z.string(),
  durationInSeconds: z.number(),
});

const OutputSchema = z.void();

export const createRetrieveTrackCacheDoc = ai.defineTool(
  {
    name: "createRetrieveTrackCacheDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Create a retrieve track cache document in DB",
  },
  async (input) => {
    const RetrieveTrackCacheRef = admin
      .firestore()
      .collection("retrieveTrackCaches")
      .doc() as DocumentReference<RetrieveTrackCache>;

    await RetrieveTrackCacheRef.set({
      ...input,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
);
