import { collection, getDocs } from "firebase/firestore";

import { db } from "@/core/firebase";
import type { TrackDocumentWithId } from "@/types/track";

export default async function getPopularTracks() {
  // TODO: Replace with actual popular track collection

  const trackCollection = collection(db, "tracks");
  const trackDocs = await getDocs(trackCollection);

  const result: TrackDocumentWithId[] = [];
  trackDocs.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() } as TrackDocumentWithId);
  });

  return result;
}
