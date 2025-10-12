import { Track } from "@lymo/schemas/shared";

import firestore from "@/core/firestore";

export default async function getPopularTracks() {
  // TODO: Replace with actual popular track collection

  const trackCollection = firestore.collection<Omit<Track, "id">>("tracks");
  const trackDocs = await trackCollection.get();

  const result: Track[] = [];
  trackDocs.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() } as Track);
  });

  return result;
}
