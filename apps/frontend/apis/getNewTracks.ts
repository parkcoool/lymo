import type { TrackDoc } from "@lymo/schemas/doc";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import db from "@/core/firestore";

export default async function getNewTracks() {
  const tracksCollection = collection(db, "tracks");
  const q = query(tracksCollection, orderBy("createdAt", "desc"), limit(10));
  const trackDocs = (await getDocs(q)) as FirebaseFirestoreTypes.QuerySnapshot<TrackDoc>;

  const result = trackDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
}
