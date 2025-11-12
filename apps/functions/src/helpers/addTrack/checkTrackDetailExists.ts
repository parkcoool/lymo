import type { Language } from "@lymo/schemas/shared";
import admin, { firestore } from "firebase-admin";

export default async function checkTrackDetailExists(trackId: string, language: Language) {
  const detailCollection = admin.firestore().collection("tracks").doc(trackId).collection("detail");
  const detailsSnap = await detailCollection
    .where(firestore.FieldPath.documentId(), "==", language)
    .get();

  return detailsSnap.size > 0;
}
