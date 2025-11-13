import type { TrackDetailDoc } from "@lymo/schemas/doc";
import { Language } from "@lymo/schemas/shared";
import { collection, doc, type FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import db from "@/core/firestore";

interface GetTrackDetailProps {
  trackId: string;
  providerId: string;
  language: Language;
}

export default async function getTrackDetail({
  trackId,
  providerId,
  language,
}: GetTrackDetailProps) {
  const tracksCollection = collection(db, "tracks");
  const trackDoc = doc(tracksCollection, trackId);
  const ProvidersCollection = collection(trackDoc, "providers");
  const providerDoc = doc(ProvidersCollection, providerId);
  const DetailsCollection = collection(providerDoc, "details");
  const detailDoc = doc(
    DetailsCollection,
    language
  ) as FirebaseFirestoreTypes.DocumentReference<TrackDetailDoc>;

  const trackDetailData = (await detailDoc.get()).data();

  if (!trackDetailData) throw new Error("곡 상세 정보를 찾을 수 없습니다.");

  return trackDetailData;
}
