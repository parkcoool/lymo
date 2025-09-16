import admin from "firebase-admin";
import { z } from "genkit";

import ai from "../core/genkit";
import { searchYouTube, YouTubeVideo } from "../tools/searchYouTube";
import { LRCLibResult } from "../tools/searchLRCLib";
import { searchLastfm } from "../tools/searchLastfm";
import { trySearchLRCLib } from "../tools/trySearchLRCLib";
import { translateLyricsFlow } from "./translateLyrics.flow";
import {
  inferSongMetadataFlow,
  inferSongMetadataOutputSchema,
} from "./inferSongMetadata.flow";
import { summarizeSongFlow } from "./summarizeSong.flow";
import { summarizeParagraphFlow } from "./summarizeParagraph.flow";

export const addSongInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
});

export const addSongStreamSchema = z
  .object({
    title: z.string().describe("The title of the song"),
    artist: z.string().describe("The artist of the song"),
    album: z.string().nullable().describe("The album of the song"),
    coverUrl: z.string().describe("The cover URL of the song"),
    publishedAt: z
      .string()
      .describe("The published date of the song")
      .nullable(),
    summary: z.string().describe("The summary of the song").nullable(),
    lyrics: z.array(
      z.object({
        summary: z
          .string()
          .nullable()
          .optional()
          .describe("The summary of the paragraph"),
        sentences: z.array(
          z.object({
            start: z
              .number()
              .describe("The start time of the sentence in seconds"),
            end: z.number().describe("The end time of the sentence in seconds"),
            text: z.string().describe("The original text of the sentence"),
            translation: z
              .string()
              .nullable()
              .optional()
              .describe("The translated text of the sentence"),
          })
        ),
      })
    ),
  })
  .partial();

export const addSongOutputSchema = z
  .string()
  .nullable()
  .describe("The ID of the added song");

/**
 * 음악 제목과 아티스트명을 입력받아 정확한 메타데이터와 가사를 포함한 음악 정보를 스트리밍하고 DB에 등록하는 플로우
 */
export const addSongFlow = ai.defineFlow(
  {
    name: "addSongFlow",
    inputSchema: addSongInputSchema,
    streamSchema: addSongStreamSchema,
    outputSchema: addSongOutputSchema,
  },
  async ({ title, artist }, { sendChunk }) => {
    let inferredMetadata: z.infer<typeof inferSongMetadataOutputSchema> | null =
      null;

    let minimumDurationGap = Infinity;
    let lrcLibResult: LRCLibResult | null = null;
    let youtubeResult: YouTubeVideo | null = null;

    const result: z.infer<typeof addSongStreamSchema> = {};

    // 입력받은 제목/아티스트명을 이용하여 유튜브에서 동영상 검색
    const videos = (await searchYouTube({ title, artist })).slice(0, 5); // 상위 5개 결과만 사용
    for (const video of videos) {
      // 입력받은 제목/아티스트명과 검색한 유튜브 동영상 제목을 바탕으로 LLM을 이용해 제목/아티스트명을 1차 교정
      if (inferredMetadata === null) {
        inferredMetadata = await inferSongMetadataFlow({
          title,
          artist,
          reference: video.videoTitle,
        });
      }

      // 교정한 제목/아티스트명과 유튜브 동영상 길이를 바탕으로 LRCLib에서 가사를 검색하고 제목/아티스트명을 2차 교정
      const lrcLibResultTemp = await trySearchLRCLib({
        ...inferredMetadata,
        duration: video.duration,
      });

      if (lrcLibResultTemp === null) continue;

      // 재생 시간 차이가 가장 적은 결과를 선택
      const durationGap = Math.abs(lrcLibResultTemp.duration - video.duration);
      if (durationGap < minimumDurationGap) {
        minimumDurationGap = durationGap;
        youtubeResult = video;
        lrcLibResult = lrcLibResultTemp;
      }
    }

    // LRCLib 또는 유튜브에서 찾기 못 했으면 null 반환
    if (lrcLibResult === null || youtubeResult === null) {
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

    result.title = lastfmResult.title;
    result.artist = lastfmResult.artist;
    result.album = lastfmResult.album;
    result.coverUrl = lastfmResult.coverUrl;
    result.publishedAt = lastfmResult.publishedAt;
    result.lyrics = [{ sentences: lrcLibResult.lyrics }];
    sendChunk(result);

    // 곡 요약 생성을 위해 `summarizeSongFlow` 플로우 실행
    const { stream: summarizeSongStream, output: summarizeSongOutput } =
      summarizeSongFlow.stream({
        title: lastfmResult.title,
        artist: lastfmResult.artist,
        album: lastfmResult.album,
        lyrics: lrcLibResult.lyrics.map((sentence) => sentence.text),
      });

    // 가사 번역을 위해 `translateLyricsFlow` 플로우 실행
    const { stream: translateLyricsStream, output: translateLyricsOutput } =
      translateLyricsFlow.stream({
        title: lastfmResult.title,
        artist: lastfmResult.artist,
        album: lastfmResult.album,
        lyrics: lrcLibResult.lyrics,
      });

    await Promise.all([
      // 곡 요약 스트림 처리
      (async () => {
        let summary = "";
        for await (const chunk of summarizeSongStream) {
          summary += chunk;
          result.summary = summary;
          sendChunk(result);
        }
        result.summary = await summarizeSongOutput;
        sendChunk(result);
      })(),

      // 가사 번역 스트림 처리
      (async () => {
        for await (const chunk of translateLyricsStream) {
          result.lyrics = chunk.map((sentences) => ({ sentences }));
          sendChunk(result);
        }
        const lyrics = await translateLyricsOutput;
        result.lyrics = lyrics.map((sentences) => ({ sentences }));
        sendChunk(result);
      })(),
    ]);

    // 문단 별 해석 생성을 위해 `summarizeParagraphFlow` 플로우 실행
    if (result.lyrics) {
      const {
        stream: summarizeParagraphStream,
        output: summarizeParagraphOutput,
      } = summarizeParagraphFlow.stream({
        title: lastfmResult.title,
        artist: lastfmResult.artist,
        album: lastfmResult.album,
        lyrics: result.lyrics.map((paragraph) =>
          paragraph.sentences.map((sentence) => sentence.text)
        ),
      });

      const addParagraphSummary = (summaries: (string | null)[]) => {
        if (!result.lyrics) return;
        for (
          let i = 0;
          i < Math.min(summaries.length, result.lyrics.length);
          i++
        ) {
          result.lyrics[i].summary = summaries[i];
          sendChunk(result);
        }
      };

      for await (const chunk of summarizeParagraphStream) {
        addParagraphSummary(chunk);
      }

      addParagraphSummary(await summarizeParagraphOutput);
    }

    // Firestore에 음악 메타데이터 및 가사 등록
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
        duration: youtubeResult?.duration,
        publishedAt: lastfmResult.publishedAt,
      }),
      detailDocRef.set({
        sourceProvider: "YouTube",
        sourceId: youtubeResult?.videoId,
        overview: result.summary,
        lyrics: result.lyrics,
      }),
    ]);

    return docRef.id;
  }
);
