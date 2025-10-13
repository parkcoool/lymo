import admin, { firestore } from "firebase-admin";

export default async function checkDuplication(trackId: string) {
  const songCollection = admin.firestore().collection("tracks");
  const matchingSongRef = await songCollection
    .where(firestore.FieldPath.documentId(), "==", trackId)
    .get();

  if (matchingSongRef.size > 0) {
    return matchingSongRef.docs[0].id;
  }

  return null;
}
