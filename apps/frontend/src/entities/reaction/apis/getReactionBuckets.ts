import type { Bucket } from "@lymo/schemas/doc";
import {
  collection,
  getDocs,
  orderBy,
  query,
  type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

import firestore from "@/core/firestore";

interface GetReactionBucketsParams {
  storyId: string;
}

export default async function getReactionBuckets({ storyId }: GetReactionBucketsParams) {
  const bucketsCollectionRef = collection(firestore, "stories", storyId, "buckets");
  const q = query(bucketsCollectionRef, orderBy("start", "asc"));

  const bucketDocs = (await getDocs(q)).docs as FirebaseFirestoreTypes.DocumentSnapshot<Bucket>[];
  const buckets = bucketDocs.map((doc) => doc.data());

  return buckets.filter((bucket) => bucket !== undefined);
}
