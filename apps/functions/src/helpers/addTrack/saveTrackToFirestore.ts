import { Lyrics } from "@lymo/schemas/shared";
import admin from "firebase-admin";

import { SpotifyResult } from "@/types/spotify";

export default async function saveTrackToFirestore(
  spotifyResult: SpotifyResult,
  summary: string,
  lyrics: Lyrics
) {
  const tracksCollection = admin.firestore().collection("tracks");

  // Firestore에 음악 메타데이터 및 가사 등록
  const docRef = tracksCollection.doc(spotifyResult.id);
  const detailCollectionRef = docRef.collection("detail");
  const detailDocRef = detailCollectionRef.doc("content");

  // db 등록
  await Promise.all([
    docRef.set({
      title: spotifyResult.title,
      artist: spotifyResult.artist,
      album: spotifyResult.album,
      coverUrl: spotifyResult.coverUrl,
      duration: spotifyResult.duration,
      publishedAt: spotifyResult.publishedAt,
    }),

    detailDocRef.set({
      summary,
      lyrics,
      lyricsProvider: "LRCLIB",
    }),
  ]);
}
