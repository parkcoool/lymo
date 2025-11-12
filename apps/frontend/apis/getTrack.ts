import type { TrackDoc } from "@lymo/schemas/doc";
import { collection, doc, type FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import db from "@/core/firestore";

interface GetTrackProps {
  trackId: string;
}

export default async function getTrack({ trackId }: GetTrackProps) {
  const tracksCollection = collection(db, "tracks");
  const trackDoc = doc(
    tracksCollection,
    trackId
  ) as FirebaseFirestoreTypes.DocumentReference<TrackDoc>;

  const trackData = (await trackDoc.get()).data();

  if (!trackData) throw new Error("곡을 찾을 수 없습니다.");

  return trackData;
}
