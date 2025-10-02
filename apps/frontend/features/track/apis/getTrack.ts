import { doc, getDoc } from "firebase/firestore";
import { Track, TrackDetail } from "@lymo/schemas/shared";

import { db } from "@/core/firebase";

interface GetTrackProps {
  trackId: string;
}

export default async function getTrack({ trackId }: GetTrackProps) {
  const trackDoc = doc(db, "tracks", trackId);
  const detailDoc = doc(db, "tracks", trackId, "detail", "content");

  const [trackSnapshot, detailSnapshot] = await Promise.all([
    getDoc(trackDoc),
    getDoc(detailDoc),
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
