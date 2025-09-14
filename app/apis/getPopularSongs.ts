import { collection, getDocs, limit, query } from "firebase/firestore";

import { db } from "~/firebase";

interface GetPopularSongsProps {
  page?: number;
}

export interface SongDocument {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
  sourceProvider: string;
  sourceId: string;
  overview: string;
  lyrics: {
    summary: string | null;
    setences: {
      start: number;
      end: number;
      text: string;
      translation: string | null;
    };
  }[];

  publishedAt: string;
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
