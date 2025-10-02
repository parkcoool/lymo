import { collection, getDocs } from "firebase/firestore";
import { Track } from "@lymo/schemas/shared";

import { db } from "@/core/firebase";

export default async function getPopularTracks() {
  // TODO: Replace with actual popular track collection

  const trackCollection = collection(db, "tracks");
  const trackDocs = await getDocs(trackCollection);

  const result: Track[] = [];
  trackDocs.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() } as Track);
  });

  return result;
}
