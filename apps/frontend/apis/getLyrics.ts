import type { LyricsDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";
import { collection, doc, type FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import db from "@/core/firestore";

interface GetLyricsProps {
  trackId: string;
  lyricsProvider: LyricsProvider;
}

export default async function getLyrics({ trackId, lyricsProvider }: GetLyricsProps) {
  const tracksCollection = collection(db, "tracks");
  const trackDoc = doc(tracksCollection, trackId);
  const lyricsCollection = collection(trackDoc, "lyrics");
  const lyricsDoc = doc(
    lyricsCollection,
    lyricsProvider
  ) as FirebaseFirestoreTypes.DocumentReference<LyricsDoc>;

  const lyricsData = (await lyricsDoc.get()).data();

  if (!lyricsData) throw new Error("가사를 찾을 수 없습니다.");

  return lyricsData;
}
