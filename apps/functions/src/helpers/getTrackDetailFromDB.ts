import { TrackDetailDoc } from "@lymo/schemas/doc";
import type { Language } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";

interface GetTrackDetailFromDBParams {
  trackId: string;
  language: Language;
  providerId: string;
}

/**
 * @description 특정 trackId, language, providerId에 해당하는 트랙 상세 정보를 DB에서 가져옵니다.
 * @param trackId 가져올 곡의 ID
 * @param language 트랙의 언어
 * @param providerId 제공자 ID
 * @returns TrackDetail 문서 데이터 또는 null (존재하지 않는 경우)
 */
export default async function getTrackDetailFromDB({
  trackId,
  language,
  providerId,
}: GetTrackDetailFromDBParams) {
  const detailCollection = admin
    .firestore()
    .collection("tracks")
    .doc(trackId)
    .collection("providers")
    .doc(providerId)
    .collection("details")
    .doc(language) as DocumentReference<TrackDetailDoc>;

  const trackDetailDocSnap = await detailCollection.get();
  if (!trackDetailDocSnap.exists) return null;
  return trackDetailDocSnap.data();
}
