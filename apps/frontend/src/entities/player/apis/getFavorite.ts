import { ERROR_CODES } from "@lymo/schemas/error";
import { doc, getDoc } from "@react-native-firebase/firestore";

import auth from "@/core/auth";
import firestore from "@/core/firestore";
import KnownError from "@/shared/errors/KnownError";

export default async function getFavorite({ storyId }: { storyId: string }) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new KnownError(ERROR_CODES.UNAUTHORIZED, "로그인이 필요합니다.");

  const favoriteDoc = doc(firestore, "stories", storyId, "favorites", userId);

  const favorite = await getDoc(favoriteDoc);
  return favorite.exists();
}
