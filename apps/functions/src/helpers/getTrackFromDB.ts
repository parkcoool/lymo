import type { TrackDoc } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";

/**
 * @description 특정 trackId에 해당하는 Track 문서를 DB에서 가져옵니다.
 * @param trackId 가져올 트랙의 ID
 * @returns Track 문서 데이터 또는 null (존재하지 않는 경우)
 */
export default async function getTrackFromDB(trackId: string) {
  const trackDocRef = admin
    .firestore()
    .collection("tracks")
    .doc(trackId) as DocumentReference<TrackDoc>;
  const trackData = (await trackDocRef.get()).data();

  return trackData ?? null;
}
