import { ERROR_CODES } from "@lymo/schemas/error";
import { doc, increment, runTransaction, serverTimestamp } from "@react-native-firebase/firestore";

import auth from "@/core/auth";
import firestore from "@/core/firestore";
import KnownError from "@/shared/errors/KnownError";

export default async function createFavorite({
  storyId,
  trackId,
}: {
  storyId: string;
  trackId: string;
}) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new KnownError(ERROR_CODES.UNAUTHORIZED, "로그인이 필요합니다.");

  const storyDoc = doc(firestore, "stories", storyId);
  const trackDoc = doc(firestore, "tracks", trackId);
  const favoriteDoc = doc(firestore, "stories", storyId, "favorites", userId);

  await runTransaction(firestore, async (transaction) => {
    transaction.update(storyDoc, {
      "stats.favoriteCount": increment(1),
    });
    transaction.update(trackDoc, {
      "stats.favoriteCount": increment(1),
    });
    transaction.set(favoriteDoc, { createdAt: serverTimestamp(), userId });
  });
}
