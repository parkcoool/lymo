import { RetrieveTrackCache } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { CollectionReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

const InputSchema = z.object({
  title: z.string(),
  artist: z.string(),
  durationInSeconds: z.number(),
});

export const OutputSchema = z.string().nullable();

export const getRetrieveTrackCacheDoc = ai.defineTool(
  {
    name: "getRetrieveTrackCacheDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description:
      "Retrieve a retrieve track cache document from DB using title, artist, and durationInSeconds",
  },
  async (input) => {
    const retrieveTrackCacheCollectionRef = admin
      .firestore()
      .collection("retrieveTrackCaches") as CollectionReference<RetrieveTrackCache>;
    const q = retrieveTrackCacheCollectionRef
      .where("title", "==", input.title)
      .where("artist", "==", input.artist)
      .where("durationInSeconds", "==", input.durationInSeconds)
      .limit(1);

    const retrieveTrackCacheSnap = (await q.get()).docs[0];
    const retrieveTrackCache = retrieveTrackCacheSnap?.data();
    if (!retrieveTrackCache) return null;
    return retrieveTrackCache.trackId;
  }
);
