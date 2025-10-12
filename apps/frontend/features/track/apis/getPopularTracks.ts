import firestore from "@react-native-firebase/firestore";

import { Track } from "@lymo/schemas/shared";

export default async function getPopularTracks() {
  // TODO: Replace with actual popular track collection

  const trackCollection = firestore().collection("tracks");
  const trackDocs = await trackCollection.get();
  const result: Track[] = [];
  trackDocs.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() } as Track);
  });

  return result;
}
