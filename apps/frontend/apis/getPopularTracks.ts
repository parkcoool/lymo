import { Track } from "@lymo/schemas/shared";
import {
  collection,
  getDocs,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import db from "@/core/firestore";

export default async function getPopularTracks() {
  // 곡 문서 가져오기
  const tracksCollection = collection(
    db,
    "tracks"
  ) as FirebaseFirestoreTypes.CollectionReference<Omit<Track, "id">>;
  const trackDocs = await (getDocs(tracksCollection) as Promise<
    FirebaseFirestoreTypes.QuerySnapshot<Omit<Track, "id">>
  >);

  const result: Track[] = [];
  trackDocs.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() } satisfies Track);
  });

  return result;
}
