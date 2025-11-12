import admin, { firestore } from "firebase-admin";

export default async function checkTrackExists(trackId: string) {
  const trackCollection = admin.firestore().collection("tracks");
  const tracksSnap = await trackCollection
    .where(firestore.FieldPath.documentId(), "==", trackId)
    .get();

  return tracksSnap.size > 0;
}
