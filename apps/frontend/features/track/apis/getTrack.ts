import firestore from "@react-native-firebase/firestore";
import { Track, TrackDetail } from "@lymo/schemas/shared";

interface GetTrackProps {
  trackId: string;
}

export default async function getTrack({ trackId }: GetTrackProps) {
  const trackDoc = firestore().collection("tracks").doc(trackId);
  const detailDoc = firestore()
    .collection("tracks")
    .doc(trackId)
    .collection("detail")
    .doc("content");

  const [trackSnapshot, detailSnapshot] = await Promise.all([
    trackDoc.get(),
    detailDoc.get(),
  ]);

  if (!trackSnapshot.exists() || !detailSnapshot.exists()) {
    throw new Error("Track not found");
  }

  const result = {
    id: trackSnapshot.id,
    ...trackSnapshot.data(),
    ...detailSnapshot.data(),
  } as Track & TrackDetail;

  return result;
}
