import { TrackDetailDoc } from "@lymo/schemas/doc";
import type { Language } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";

export default async function getTrackDetailFromDB({
  trackId,
  language,
  providerId,
}: {
  trackId: string;
  language: Language;
  providerId: string;
}) {
  const detailCollection = admin
    .firestore()
    .collection("tracks")
    .doc(trackId)
    .collection("providers")
    .doc(providerId)
    .collection("details")
    .doc(language) as DocumentReference<TrackDetailDoc>;

  const detailData = (await detailCollection.get()).data();
  return detailData ?? null;
}
