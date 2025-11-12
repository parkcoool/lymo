import { Language, Lyrics } from "@lymo/schemas/shared";
import admin from "firebase-admin";

export default async function saveTrackDetailToFirestore(
  trackId: string,
  {
    summary,
    lyrics,
    language,
  }: {
    summary: string;
    lyrics: Lyrics;
    language: Language;
  }
) {
  const trackDetailDocRef = admin
    .firestore()
    .collection("tracks")
    .doc(trackId)
    .collection("detail")
    .doc(language);

  await trackDetailDocRef.set({
    summary,
    lyrics,
    lyricsProvider: "LRCLIB",
  });
}
