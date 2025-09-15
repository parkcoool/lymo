import admin from "firebase-admin";
import { z } from "genkit";

import ai from "../core/genkit";
import { searchYouTube, YouTubeVideo } from "../tools/searchYouTube";
import { LRCLibResult } from "../tools/searchLRCLib";
import { searchLastfm } from "../tools/searchLastfm";
import { trySearchLRCLib } from "../tools/trySearchLRCLib";
import { translateLyricsFlow } from "./translateLyrics.flow";
import { inferSongMetadataFlow } from "./inferSongMetadata";

export const addSongInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
});

export const addSongOutputSchema = z
  .string()
  .nullable()
  .describe("The ID of the added song");

// 메타데이터 교정 출력 스키마
export const metadataNormalizerOutputSchema = z.object({
  koreanArtist: z
    .string()
    .describe("The official Korean name of the artist")
    .nullable(),
  englishArtist: z
    .string()
    .describe("The official English name of the artist")
    .nullable(),
  koreanTitle: z
    .string()
    .describe("The official Korean title of the song")
    .nullable(),
  englishTitle: z
    .string()
    .describe("The official English title of the song")
    .nullable(),
});

/**
 * 음악 제목과 아티스트명을 입력받아 정확한 메타데이터와 가사를 포함한 음악 정보를 DB에 등록하는 플로우
 * 1. 입력받은 제목/아티스트명을 이용하여 유튜브에서 동영상 검색
 * 2. 입력받은 제목/아티스트명과 검색한 유튜브 동영상 제목을 바탕으로 LLM을 이용해 제목/아티스트명을 1차 교정
 * 3. 교정한 제목/아티스트명과 유튜브 동영상 길이를 바탕으로 LRCLib에서 가사를 검색하고 제목/아티스트명을 2차 교정
 * 4. 교정한 제목/아티스트명을 바탕으로 Last.fm에서 공식적인 메타데이터(앨범명, 발매일, 커버 이미지 등) 획득
 * 5. 가사 번역을 위해 `translateLyricsFlow` 플로우 실행
 * 6.
 */
export const addSongFlow = ai.defineFlow(
  {
    name: "addSongFlow",
    inputSchema: addSongInputSchema,
    outputSchema: addSongOutputSchema,
  },
  async ({ title, artist }) => {
    // 1. 입력받은 제목/아티스트명을 이용하여 유튜브에서 동영상 검색

    let inferredMetadata: z.infer<
      typeof metadataNormalizerOutputSchema
    > | null = null;

    let minimumDurationGap = Infinity;
    let lrcLibResult: LRCLibResult | null = null;
    let youtubeVideo: YouTubeVideo | null = null;

    const videos = (await searchYouTube({ title, artist })).slice(0, 5); // 상위 5개 결과만 사용
    for (const video of videos) {
      // 2. 입력받은 제목/아티스트명과 검색한 유튜브 동영상 제목을 바탕으로 LLM을 이용해 제목/아티스트명을 1차 교정
      if (inferredMetadata === null) {
        inferredMetadata = await inferSongMetadataFlow({
          title,
          artist,
          reference: video.videoTitle,
        });
      }

      // 3. 교정한 제목/아티스트명과 유튜브 동영상 길이를 바탕으로 LRCLib에서 가사를 검색하고 제목/아티스트명을 2차 교정
      const foundLRCLib = await trySearchLRCLib({
        ...inferredMetadata,
        duration: video.duration,
      });

      if (foundLRCLib === null) continue;

      // 재생 시간 차이가 가장 적은 결과를 선택
      const durationGap = Math.abs(foundLRCLib.duration - video.duration);
      if (durationGap < minimumDurationGap) {
        minimumDurationGap = durationGap;
        youtubeVideo = video;
        lrcLibResult = foundLRCLib;
      }
    }

    if (lrcLibResult === null || youtubeVideo === null) {
      return null;
    }

    // 4. 교정한 제목/아티스트명을 바탕으로 Last.fm에서 공식적인 메타데이터(앨범명, 발매일, 커버 이미지 등) 획득
    const lastfmResult = await searchLastfm({
      title: lrcLibResult.title,
      artist: lrcLibResult.artist,
    });

    // Last.fm에서 못 찾았으면 null 반환
    if (lastfmResult === null) {
      return null;
    }

    const songCollection = admin.firestore().collection("song");
    const matchingSongRef = await songCollection
      .where("title", "==", lastfmResult.title)
      .where("artist", "==", lastfmResult.artist)
      .get();

    // 중복 등록 방지
    if (matchingSongRef.size > 0) {
      return matchingSongRef.docs[0].id;
    }

    // 5. 가사 번역을 위해 `translateLyricsFlow` 플로우 실행
    const lyrics = await translateLyricsFlow({
      title: lastfmResult.title,
      artist: lastfmResult.artist,
      album: lastfmResult.album,
      lyrics: lrcLibResult.lyrics,
    });

    // 6. Firestore에 음악 메타데이터 및 가사 등록
    const docRef = songCollection.doc();
    const detailCollectionRef = docRef.collection("detail");
    const detailDocRef = detailCollectionRef.doc("content");

    // db 등록
    await Promise.all([
      docRef.set({
        title: lastfmResult.title,
        artist: lastfmResult.artist,
        album: lastfmResult.album,
        coverUrl: lastfmResult.coverUrl,
        duration: youtubeVideo?.duration,
        publishedAt: lastfmResult.publishedAt,
      }),
      detailDocRef.set({
        sourceProvider: "YouTube",
        sourceId: youtubeVideo?.videoId,
        lyrics,
      }),
    ]);

    return docRef.id;
  }
);
