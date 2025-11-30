import type { Track } from "@lymo/schemas/doc";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import db from "@/core/firestore";

export default async function getPopularTracks() {
  const trackCollectionRef = collection(db, "tracks");
  const q = query(
    trackCollectionRef,
    orderBy("stats.viewCount", "desc"),
    orderBy("createdAt", "asc"),
    limit(20)
  );
  const trackDocs = (await getDocs(q)) as FirebaseFirestoreTypes.QuerySnapshot<Track>;

  const result = trackDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
}
