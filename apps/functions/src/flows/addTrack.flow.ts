import { LyricsDoc, TrackDoc } from "@lymo/schemas/doc";
import { AddTrackFlowInputSchema, AddTrackFlowOutputSchema } from "@lymo/schemas/function";
import { LyricsProvider } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";

import ai from "@/core/genkit";
import getLyricsFromLRCLIB from "@/helpers/addTrack/getLyricsFromLRCLIB";
import getLyricsFromDB from "@/helpers/shared/getLyricsFromDB";
import getTrackFromDB from "@/helpers/shared/getTrackFromDB";
import { searchSpotify } from "@/tools/searchSpotify";

/**
 * @description 음악 제목과 아티스트명을 입력받아 메타데이터와 가사 원문을 가져오고 DB에 저장하는 플로우
 *
 * DB에 이미 존재하는 트랙인 경우, 기존 데이터를 반환합니다.
 */
export const addTrackFlow = ai.defineFlow(
  {
    name: "addTrackFlow",
    inputSchema: AddTrackFlowInputSchema,
    outputSchema: AddTrackFlowOutputSchema,
  },
  async (input) => {
    // 1) title과 arist가 둘 다 빈 문자열인 경우
    if (input.title.trim() === "" && input.artist.trim() === "") return { notFound: true as const };

    // 2) Spotify에서 곡 검색
    const spotifyResult = await searchSpotify({
      title: input.title,
      artist: input.artist,
      duration: input.duration,
    });
    if (spotifyResult === null) return { notFound: true as const };
    const trackId = spotifyResult.id;

    // 3) 중복 확인
    const existingTrack = await getTrackFromDB(trackId);
    if (existingTrack) {
      const existingLyrics = await getLyricsFromDB(trackId);

      // 3-1) 기존에 가사 상세 정보가 모두 있는 경우 바로 반환
      if (existingLyrics) {
        return {
          id: trackId,
          track: existingTrack,
          lyrics: existingLyrics.lyrics,
          lyricsProvider: existingLyrics.provider,
          notFound: false as const,
        };
      }
    }

    // 4) LRCLIB에서 곡 검색
    const lrclibResult = await getLyricsFromLRCLIB(
      spotifyResult.title,
      spotifyResult.artist,
      spotifyResult.duration
    );
    if (!lrclibResult) return { notFound: true as const };
    const lyricsProvider: LyricsProvider = "lrclib";

    // 5) 트랙 및 가사 정보를 DB에 저장
    const trackDocRef = admin
      .firestore()
      .collection("tracks")
      .doc(trackId) as DocumentReference<TrackDoc>;
    const lyricsDocRef = trackDocRef
      .collection("lyrics")
      .doc(lyricsProvider) as DocumentReference<LyricsDoc>;

    const track: TrackDoc = {
      album: spotifyResult.album,
      artist: spotifyResult.artist,
      coverUrl: spotifyResult.coverUrl,
      duration: spotifyResult.duration,
      publishedAt: spotifyResult.publishedAt,
      title: spotifyResult.title,
      createdAt: new Date().toISOString(),
      lyricsProviders: [lyricsProvider],
    };

    await admin.firestore().runTransaction(async (transaction) => {
      transaction.set(trackDocRef, track);
      transaction.set(lyricsDocRef, {
        lyrics: lrclibResult.lyrics,
      });
    });

    // 6) 트랙 및 가사 정보 반환
    return {
      id: trackId,
      track,
      lyrics: lrclibResult.lyrics,
      lyricsProvider,
      notFound: false as const,
    };
  }
);
