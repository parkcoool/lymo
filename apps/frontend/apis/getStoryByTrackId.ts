import type { Story } from "@lymo/schemas/doc";
import { Language } from "@lymo/schemas/shared";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import db from "@/core/firestore";

interface GetStoryByTrackIdParams {
  trackId: string;
  language: Language;
}

export default async function getStoryByTrackId({ trackId, language }: GetStoryByTrackIdParams) {
  const storyCollectionRef = collection(db, "stories");
  const q = query(
    storyCollectionRef,
    where("language", "==", language),
    where("trackId", "==", trackId),
    limit(1)
  );

  const storyDoc = (await getDocs(q)).docs[0] as
    | FirebaseFirestoreTypes.QueryDocumentSnapshot<Story>
    | undefined;
  return storyDoc?.data() ?? null;
}
