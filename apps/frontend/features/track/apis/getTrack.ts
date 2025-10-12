import { Track, TrackDetail } from "@lymo/schemas/shared";

import firestore from "@/core/firestore";

interface GetTrackProps {
  trackId: string;
}

export default async function getTrack({ trackId }: GetTrackProps) {
  const trackDoc = firestore
    .collection<Omit<Track, "id">>("tracks")
    .doc(trackId);
  const detailDoc = trackDoc.collection("detail").doc("content");

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
