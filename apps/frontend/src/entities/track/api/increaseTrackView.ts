import type { Track } from "@lymo/schemas/doc";
import {
  doc,
  updateDoc,
  type FirebaseFirestoreTypes,
  increment,
} from "@react-native-firebase/firestore";

import firestore from "@/core/firestore";

export default async function increaseTrackView(trackId: string) {
  const trackDoc = doc(
    firestore,
    "tracks",
    trackId
  ) as FirebaseFirestoreTypes.DocumentReference<Track>;

  await updateDoc(trackDoc, {
    "stats.viewCount": increment(1),
  });
}
