import { collection, getDocs } from "firebase/firestore";

import { db } from "~/firebase";
import type { SongDocument } from "~/types/song";

interface GetPopularSongsProps {
  page?: number;
}

export default async function getPopularSongs({
  page = 0,
}: GetPopularSongsProps) {
  // TODO: Replace with actual popular song collection

  const songRef = collection(db, "song");
  const songSnap = await getDocs(songRef);
  const result: SongDocument[] = [];
  songSnap.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() } as SongDocument);
  });
  return result;
}
