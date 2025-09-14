import admin from "firebase-admin";
import { z } from "genkit";

import ai from "../core/genkit";
import { getYouTube, type YouTubeVideo } from "../utils/getYouTube";
import { searchLRCLibOutputSchema } from "../tools/searchLRCLib";
import { searchLastfm } from "../tools/searchLastfm";
import { trySearchLRCLib } from "../tools/trySearchLRCLib";
import { processLyricsFlow } from "./processLyrics.flow";
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
 * 5. 가사 요약 및 문단 분할을 위해 `processLyricsFlow` 플로우 실행
 * 6. Firestore에 음악 메타데이터 및 가사 등록
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
    let lrcLibResult: z.infer<typeof searchLRCLibOutputSchema> | null = null;
    let youtubeVideo: YouTubeVideo | null = null;

    const videos = getYouTube({ title, artist });
    for await (const video of videos) {
      // 2. 입력받은 제목/아티스트명과 검색한 유튜브 동영상 제목을 바탕으로 LLM을 이용해 제목/아티스트명을 1차 교정
      if (inferredMetadata === null) {
        inferredMetadata = await inferSongMetadataFlow({
          title,
          artist,
          reference: video.videoTitle,
        });
      }

      // 3. 교정한 제목/아티스트명과 유튜브 동영상 길이를 바탕으로 LRCLib에서 가사를 검색하고 제목/아티스트명을 2차 교정
      lrcLibResult = await trySearchLRCLib({
        ...inferredMetadata,
        duration: video.duration,
      });

      // 가사를 찾았으면 반복문 종료
      if (lrcLibResult) {
        youtubeVideo = video;
        break;
      }
    }

    // 유튜브 검색 결과를 다 사용했는데도 못 찾았으면 null 반환
    if (youtubeVideo === null || lrcLibResult === null) {
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

    // 5. 가사 요약 및 문단 분할을 위해 `processLyricsFlow` 플로우 실행
    const { overview, paragraphs } = await processLyricsFlow({
      title: lastfmResult.title,
      artist: lastfmResult.artist,
      album: lastfmResult.album,
      lyrics: lrcLibResult.lyrics,
      summary: lastfmResult.summary,
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
        overview,
        lyrics: paragraphs,
      }),
    ]);

    return docRef.id;
  }
);
