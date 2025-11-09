import { Track, TrackDetail } from "@lymo/schemas/shared";
import {
  collection,
  doc,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import db from "@/core/firestore";

interface GetTrackProps {
  trackId: string;
}

export default async function getTrack({ trackId }: GetTrackProps) {
  // 곡 문서 가져오기
  const tracksCollection = collection(
    db,
    "tracks"
  ) as FirebaseFirestoreTypes.CollectionReference<Omit<Track, "id">>;
  const trackDoc = doc(
    tracksCollection,
    trackId
  ) as FirebaseFirestoreTypes.DocumentReference<Omit<Track, "id">>;

  // 곡 상세 정보 문서 가져오기
  const trackDetailCollection = trackDoc.collection(
    "detail"
  ) as FirebaseFirestoreTypes.CollectionReference<TrackDetail>;
  const trackDetailDoc = doc(
    trackDetailCollection,
    "content"
  ) as FirebaseFirestoreTypes.DocumentReference<TrackDetail>;

  // 문서 로드
  const [trackSnapshot, trackDetailSnapshot] = await Promise.all([
    trackDoc.get(),
    trackDetailDoc.get(),
  ]);

  const track = trackSnapshot.data();
  const trackDetail = trackDetailSnapshot.data();

  if (
    !trackSnapshot.exists() ||
    !trackDetailSnapshot.exists() ||
    !track ||
    !trackDetail
  ) {
    throw new Error("Track not found");
  }

  const result: Track & TrackDetail = {
    id: trackSnapshot.id,
    ...track,
    ...trackDetail,
  };

  return result;
}
