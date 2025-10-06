import admin, { firestore } from "firebase-admin";

import {
  AddTrackFlowInputSchema,
  AddTrackFlowStreamSchema,
  AddTrackFlowOutputSchema,
} from "@lymo/schemas/function";

import ai from "../core/genkit";
import { searchLRCLib } from "../tools/searchLRCLib";
import { searchSpotify } from "../tools/searchSpotify";
import { translateLyricsFlow } from "./translateLyrics.flow";
import { summarizeSongFlow } from "./summarizeSong.flow";
import { summarizeParagraphFlow } from "./summarizeParagraph.flow";

/**
 * 음악 제목과 아티스트명을 입력받아 정확한 메타데이터와 가사를 포함한 음악 정보를 스트리밍하고 DB에 등록하는 플로우
 */
export const addTrackFlow = ai.defineFlow(
  {
    name: "addTrackFlow",
    inputSchema: AddTrackFlowInputSchema,
    streamSchema: AddTrackFlowStreamSchema,
    outputSchema: AddTrackFlowOutputSchema,
  },
  async (input, { sendChunk }) => {
    // Spotify에서 곡 검색
    const spotifyResult = await searchSpotify({
      title: input.title,
      artist: input.artist,
    });
    if (spotifyResult === null) return { notFound: true };

    // LRCIB에서 곡 검색
    const lrcLibResult = await searchLRCLib({
      title: spotifyResult.title,
      artist: spotifyResult.artist,
      duration: input.duration,
    });
    if (lrcLibResult === null) return { notFound: true };

    // 중복 등록 방지
    const songCollection = admin.firestore().collection("tracks");
    const matchingSongRef = await songCollection
      .where(firestore.FieldPath.documentId(), "==", spotifyResult.id)
      .get();
    if (matchingSongRef.size > 0) {
      return {
        duplicate: true,
        id: matchingSongRef.docs[0].id,
      };
    }

    // 메타데이터 전송
    sendChunk({
      event: "metadata_update",
      data: {
        id: spotifyResult.id,
        title: spotifyResult.title,
        artist: spotifyResult.artist,
        album: spotifyResult.album,
        coverUrl: spotifyResult.coverUrl,
        publishedAt: spotifyResult.publishedAt,
        lyricsProvider: "LRCLIB",
      },
    });

    // 곡 요약 생성을 위해 `summarizeSongFlow` 플로우 실행
    const { stream: summarizeSongStream, output: summarizeSongOutput } =
      summarizeSongFlow.stream({
        title: spotifyResult.title,
        artist: spotifyResult.artist,
        album: spotifyResult.album,
        lyrics: lrcLibResult.lyrics.map((sentence) => sentence.text),
      });

    // 가사 번역을 위해 `translateLyricsFlow` 플로우 실행
    const { stream: translateLyricsStream, output: translateLyricsOutput } =
      translateLyricsFlow.stream({
        title: spotifyResult.title,
        artist: spotifyResult.artist,
        album: spotifyResult.album,
        lyrics: lrcLibResult.lyrics,
      });

    // summarizeSongStream 및 translateLyricsStream 처리
    await Promise.all([
      (async () => {
        for await (const chunk of summarizeSongStream) {
          sendChunk(chunk);
        }
      })(),
      (async () => {
        for await (const chunk of translateLyricsStream) {
          sendChunk(chunk);
        }
      })(),
    ]);

    const lyrics: {
      sentences: {
        start: number;
        end: number;
        text: string;
        translation: string;
      }[];
      summary: string;
    }[] = (await translateLyricsOutput).map((paragraph) => ({
      sentences: paragraph,
      summary: "",
    }));

    // 문단 별 해석 생성을 위해 `summarizeParagraphFlow` 플로우 실행
    const {
      stream: summarizeParagraphStream,
      output: summarizeParagraphOutput,
    } = summarizeParagraphFlow.stream({
      title: spotifyResult.title,
      artist: spotifyResult.artist,
      album: spotifyResult.album,
      lyrics: lyrics.map((paragraph) => paragraph.sentences.map((s) => s.text)),
    });

    // summarizeParagraphStream 처리
    for await (const chunk of summarizeParagraphStream) {
      sendChunk(chunk);
    }

    // summarizeParagraphOutput 처리
    (await summarizeParagraphOutput).forEach((summary, paragraphIndex) => {
      lyrics[paragraphIndex].summary = summary ?? "";
    });

    // Firestore에 음악 메타데이터 및 가사 등록
    const docRef = songCollection.doc(spotifyResult.id);
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
        summary: await summarizeSongOutput,
        lyrics,
        lyricsProvider: "LRCLIB",
      }),
    ]);

    sendChunk({ event: "complete", data: null });

    return {
      duplicate: false,
      id: spotifyResult.id,
    };
  }
);
