import { doc, increment, runTransaction } from "@react-native-firebase/firestore";

import firestore from "@/core/firestore";

export default async function increaseViews({
  storyId,
  trackId,
}: {
  storyId: string;
  trackId: string;
}) {
  const storyDoc = doc(firestore, "stories", storyId);
  const trackDoc = doc(firestore, "tracks", trackId);

  await runTransaction(firestore, async (transaction) => {
    transaction.update(storyDoc, {
      "stats.viewCount": increment(1),
    });
    transaction.update(trackDoc, {
      "stats.viewCount": increment(1),
    });
  });
}
