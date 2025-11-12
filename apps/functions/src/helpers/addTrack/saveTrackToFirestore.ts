import admin from "firebase-admin";

import { SpotifyResult } from "@/types/spotify";

export default async function saveTrackToFirestore(trackId: string, spotifyResult: SpotifyResult) {
  const trackDocRef = admin.firestore().collection("tracks").doc(trackId);

  // db 등록
  await trackDocRef.set({
    title: spotifyResult.title,
    artist: spotifyResult.artist,
    album: spotifyResult.album,
    coverUrl: spotifyResult.coverUrl,
    duration: spotifyResult.duration,
    publishedAt: spotifyResult.publishedAt,
  });
}
