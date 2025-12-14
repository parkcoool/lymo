import type { Track } from "@lymo/schemas/doc";
import { doc, updateDoc, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import firestore from "@/core/firestore";

export default async function increaseStoryView(storyId: string) {
  const storyDoc = doc(
    firestore,
    "stories",
    storyId
  ) as FirebaseFirestoreTypes.DocumentReference<Track>;

  await updateDoc(storyDoc, {
    "stats.viewCount": FirebaseFirestoreTypes.FieldValue.increment(1),
  });
}
