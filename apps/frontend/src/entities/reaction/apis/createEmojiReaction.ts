import { ERROR_CODES } from "@lymo/schemas/error";
import {
  collection,
  doc,
  increment,
  runTransaction,
  serverTimestamp,
} from "@react-native-firebase/firestore";

import auth from "@/core/auth";
import firestore from "@/core/firestore";
import KnownError from "@/shared/errors/KnownError";

export default async function createEmojiReaction({
  storyId,
  emoji,
  timestampInSeconds,
}: {
  storyId: string;
  emoji: string;
  timestampInSeconds: number;
}) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new KnownError(ERROR_CODES.UNAUTHORIZED, "로그인이 필요합니다.");

  const storyDoc = doc(firestore, "stories", storyId);

  const reactionsCollection = collection(storyDoc, "reactions");
  const reactionDoc = doc(reactionsCollection);

  const bucketsCollection = collection(storyDoc, "buckets");
  const bucketDoc = doc(bucketsCollection, Math.floor(timestampInSeconds / 5).toString());

  await runTransaction(firestore, async (transaction) => {
    transaction.set(reactionDoc, {
      userId,
      createdAt: serverTimestamp(),
      timestampInSeconds,
      type: "emoji",
      content: emoji,
    });

    transaction.update(bucketDoc, {
      [`counts.${emoji}`]: increment(1),
    });
  });
}
