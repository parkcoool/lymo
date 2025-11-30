import type { Track } from "@lymo/schemas/doc";
import { collection, doc, type FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import db from "@/core/firestore";

export default async function getTrackById(trackId: string) {
  const trackCollectionRef = collection(db, "tracks");
  const trackDocRef = doc(
    trackCollectionRef,
    trackId
  ) as FirebaseFirestoreTypes.DocumentReference<Track>;
  return (await trackDocRef.get()).data() ?? null;
}
