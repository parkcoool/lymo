import type { Story } from "@lymo/schemas/doc";
import {
  doc,
  updateDoc,
  type FirebaseFirestoreTypes,
  increment,
} from "@react-native-firebase/firestore";

import firestore from "@/core/firestore";

export default async function increaseStoryView(storyId: string) {
  const storyDoc = doc(
    firestore,
    "stories",
    storyId
  ) as FirebaseFirestoreTypes.DocumentReference<Story>;

  await updateDoc(storyDoc, {
    "stats.viewCount": increment(1),
  });
}
