import { doc, getDoc } from "firebase/firestore";

import { db } from "~/core/firebase";
import type { SongDetailDocument, SongDocument } from "~/types/song";

interface GetSongProps {
  songId: string;
}

export default async function getSong({ songId }: GetSongProps) {
  const songRef = doc(db, "song", songId);
  const detailRef = doc(db, "song", songId, "detail", "content");

  const [songSnap, detailSnap] = await Promise.all([
    getDoc(songRef),
    getDoc(detailRef),
  ]);

  const result = {
    id: songSnap.id,
    ...songSnap.data(),
    ...detailSnap.data(),
  } as SongDocument & SongDetailDocument;
  return result;
}
