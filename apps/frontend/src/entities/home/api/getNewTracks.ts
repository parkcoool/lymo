import type { Track } from "@lymo/schemas/doc";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import firestore from "@/core/firestore";

export default async function getNewTracks() {
  const trackCollectionRef = collection(firestore, "tracks");
  const q = query(trackCollectionRef, orderBy("createdAt", "desc"), limit(10));
  const trackDocs = (await getDocs(q)) as FirebaseFirestoreTypes.QuerySnapshot<Track>;

  const result = trackDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
}
