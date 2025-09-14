import admin from "firebase-admin";
import { z } from "genkit";

import ai from "../core/genkit";
import { getYouTube } from "../tools/getYouTube";
import { searchLRCLib, searchLRCLibOutputSchema } from "../tools/searchLRCLib";
import { searchLastfm } from "../tools/searchLastfm";
import { processLyricsFlow } from "./processLyrics.flow";

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

// 1. 유튜브 검색을 통해 유튜브 동영상 제목, 트랙 길이 획득
// 2. 유튜브 동영상 제목을 이용하여 LLM을 통해 제목/아티스트명 1차 교정
// 3. LRCLib에서 음악 검색 후 가사 획득, 제목/아티스트명 2차 교정
// 4. Last.fm에서 공식적인 정보 획득
export const addSongFlow = ai.defineFlow(
  {
    name: "addSongFlow",
    inputSchema: addSongInputSchema,
    outputSchema: addSongOutputSchema,
  },
  async ({ title, artist }) => {
    // 1. 유튜브 검색을 통해 유튜브 동영상 제목, 트랙 길이 획득
    const { videoId, videoTitle, duration } = await getYouTube({
      title,
      artist,
    });

    // 2. 유튜브 동영상 제목을 이용하여 LLM을 통해 제목/아티스트명 1차 교정
    const { output: metadatas } = await ai.generate({
      system: `
      # 역할(Role)
      너는 음악 메타데이터를 구축하고 관리하는 최고 수준의 전문가이다. 너의 최우선 가치는 '정확성'과 '일관성'이다.

      # 임무(Task)
      너는 오타가 있을 수 있는 {rawTitle}, {rawArtist}과 참조용 {videoTitle}을 입력받는다. 이 정보를 바탕으로 아래 단계를 논리적으로 수행하여 최종 결과를 JSON 형식으로 반환해야 한다.

      # 처리 단계(Chain-of-Thought)
      1.  **분석 및 추론:**
          * {videoTitle}의 내용을 분석하여 가장 가능성이 높은 정확한 아티스트와 노래 제목을 추론한다.

      2.  **정보 교정 및 확정:**
          * 추론을 바탕으로 정확한 한국어 아티스트명(koreanArtist)과 노래 제목(koreanTitle)을 확정한다.

      3.  **영문명 탐색:**
          * 확정된 아티스트의 공식 영문 활동명(englishArtist)을 추론한다. (주의: 단순 로마자 표기가 아님)
          * 확정된 노래의 공식 영문 제목(englishTitle)을 추론한다. (주의: 기계 번역이나 직역이 아님)

      ### 예외 처리 규칙(Rules)
      주어진 정보만으로 아티스트의 공식 활동명이나 노래의 공식 제목을 알 수 없으면 각 값은 null 값으로 설정한다.
      `,
      prompt: `
          {
            "rawTitle": "${title}",
            "rawArtist": "${artist}",
            "videoTitle": "${videoTitle}"
          }`,
      output: {
        schema: metadataNormalizerOutputSchema,
      },
      config: {
        temperature: 0.3,
      },
    });

    if (metadatas === null) {
      throw new Error("Response doesn't satisfy schema.");
    }

    const { koreanArtist, englishArtist, koreanTitle, englishTitle } =
      metadatas;

    // 가능한 모든 제목/아티스트명 조합 생성
    const combinations: [string, string][] = [];
    if (koreanTitle && koreanArtist)
      combinations.push([koreanTitle, koreanArtist]);
    if (englishTitle && englishArtist)
      combinations.push([englishTitle, englishArtist]);
    if (koreanTitle && englishArtist)
      combinations.push([koreanTitle, englishArtist]);
    if (englishTitle && koreanArtist)
      combinations.push([englishTitle, koreanArtist]);
    if (combinations.length === 0) combinations.push([title, artist]);

    // 3. LRCLib에서 음악 검색 후 가사 획득, 제목/아티스트명 2차 교정
    let lrclibResult: z.infer<typeof searchLRCLibOutputSchema>["song"] = null;
    for (const [tryTitle, tryArtist] of combinations) {
      const { song: trySong } = await searchLRCLib({
        title: tryTitle,
        artist: tryArtist,
        duration,
      });

      // 음악을 못 찾았으면 다음 조합 시도
      if (trySong === null) continue;

      lrclibResult = trySong;
      break;
    }

    // 적합한 후보가 없으면 null 반환
    if (lrclibResult === null) {
      return null;
    }

    // 4. Last.fm에서 공식적인 정보 획득
    const lastfmResult = await searchLastfm({
      title: lrclibResult.title,
      artist: lrclibResult.artist,
    });

    // Last.fm에서 못 찾았으면 null 반환
    const { song } = lastfmResult;
    if (song === null) {
      return null;
    }

    const songCollection = admin.firestore().collection("song");
    const existingDoc = await songCollection
      .where("title", "==", song.title)
      .where("artist", "==", song.artist)
      .get();

    // 중복 등록 방지
    if (existingDoc.size > 0) {
      return existingDoc.docs[0].id;
    }

    const { overview, paragraphs } = await processLyricsFlow({
      title: lrclibResult.title,
      artist: lrclibResult.artist,
      album: song.album,
      lyrics: lrclibResult.lyrics,
      summary: song.summary,
    });

    const doc = songCollection.doc();

    // db 등록
    await doc.set({
      title: song.title,
      artist: song.artist,
      album: song.album,
      coverUrl: song.coverUrl,
      duration,
      sourceProvider: "YouTube",
      sourceId: videoId,
      overview,
      lyrics: paragraphs,
      publishedAt: song.publishedAt,
    });

    return doc.id;
  }
);
