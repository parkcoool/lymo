import type { LyricsDoc } from "@lymo/schemas/doc";
import type { LyricsProvider } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";

/**
 * @description 특정 trackId에 해당하는 Lyrics 문서를 DB에서 가져옵니다.
 * @param trackId 가져올 트랙의 ID
 * @param lyricsProvider (선택 사항) 특정 가사 제공자를 지정합니다. 지정하지 않으면 정해진 우선 순위에 따라 첫 번째로 발견된 문서를 반환합니다.
 * @returns 가사 제공자와 Lyrics 문서 데이터로 이루어진 객체, 또는 null (존재하지 않는 경우)
 */
export default async function getLyricsFromDB(trackId: string, lyricsProvider?: LyricsProvider) {
  const lyricsCollectionRef = admin
    .firestore()
    .collection("tracks")
    .doc(trackId)
    .collection("lyrics");

  // 특정 가사 제공자가 지정된 경우
  if (lyricsProvider) {
    const lyricsDocRef = lyricsCollectionRef.doc(lyricsProvider) as DocumentReference<LyricsDoc>;
    const lyricsData = (await lyricsDocRef.get()).data()?.lyrics;
    if (lyricsData) return { lyrics: lyricsData, provider: lyricsProvider };
  }

  // 가사 제공자가 지정되지 않은 경우, 우선 순위에 따라 첫 번째로 발견된 문서를 반환
  const lyricsProviders: LyricsProvider[] = ["lrclib", "none"];

  let result: { lyrics: LyricsDoc["lyrics"]; provider: LyricsProvider } | null = null;
  for (const provider of lyricsProviders) {
    const lyricsDocRef = lyricsCollectionRef.doc(provider) as DocumentReference<LyricsDoc>;
    const lyricsData = (await lyricsDocRef.get()).data()?.lyrics;

    if (lyricsData) {
      result = { lyrics: lyricsData, provider };
      break;
    }
  }

  return result;
}
