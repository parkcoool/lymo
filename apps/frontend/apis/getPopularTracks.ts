import type { TrackDoc } from "@lymo/schemas/doc";
import { collection, getDocs, type FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import db from "@/core/firestore";

export default async function getPopularTracks() {
  // TODO: 실제 인기 트랙 기준으로 변경 필요
  const tracksCollection = collection(db, "tracks");
  const trackDocs = await (getDocs(tracksCollection) as Promise<
    FirebaseFirestoreTypes.QuerySnapshot<TrackDoc>
  >);

  const result = trackDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return result;
}
