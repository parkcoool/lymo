import { DocumentReference } from "@google-cloud/firestore";
import { LyricsDoc } from "@lymo/schemas/doc";
import { GetTrackFromIdFlowStreamSchema } from "@lymo/schemas/function";
import { Language, LLMModel } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { z } from "genkit";

import { generateTrackDetail } from "@/flows/generateTrackDetail.flow";

import getLyricsFromDB from "./getLyricsFromDB";
import getLyricsFromLRCLIB from "./getLyricsFromLRCLIB";

interface StreamLyricsAndTrackDetailParams {
  track: {
    trackId: string;
    title: string;
    album: string | null;
    artists: string[];
    duration: number;
  };
  config: {
    language: Language;
    model: LLMModel;
  };
}

/**
 * @description 가사를 가져온 뒤 트랙 상세 정보와 함께 스트리밍하는 헬퍼 함수
 * @param trackId 트랙 ID
 * @param metadata 트랙 메타데이터
 * @param language 생성할 상세 정보의 언어
 * @param model 생성할 상세 정보의 LLM 모델
 */
export async function* streamLyricsAndTrackDetail({
  track: { trackId, title, album, artists, duration },
  config: { language, model },
}: StreamLyricsAndTrackDetailParams): AsyncGenerator<
  z.infer<typeof GetTrackFromIdFlowStreamSchema>
> {
  // 1) lyrics 문서 가져오기
  const lyricsDoc = await getLyricsFromDB({ trackId });

  let lyrics = lyricsDoc?.lyrics;
  let lyricsProvider = lyricsDoc?.provider;

  // 2) lyrics 문서가 존재하지 않는 경우 LRCLIB에서 검색
  if (!lyricsDoc || !lyrics || !lyricsProvider) {
    const lrclibResult = await getLyricsFromLRCLIB({ title, artists, duration });

    // 2-1) LRCLIB에서 가사를 찾은 경우
    if (lrclibResult) {
      lyrics = lrclibResult.lyrics;
      lyricsProvider = "lrclib";
    }

    // 2-2) LRCLIB에서 가사를 찾지 못 한 경우 error 반환
    else throw new Error("Lyrics not found");

    // 2-3) 가사 정보 스트림
    yield {
      event: "update_lyrics",
      data: { lyrics, lyricsProvider },
    };

    // 2-4) 가사를 DB에 저장
    const lyricsDocRef = admin
      .firestore()
      .collection("tracks")
      .doc(trackId)
      .collection("lyrics")
      .doc(lyricsProvider) as DocumentReference<LyricsDoc>;
    await lyricsDocRef.set({ lyrics });
  } else {
    // 기존 가사 정보 스트림
    yield {
      event: "update_lyrics",
      data: { lyrics, lyricsProvider },
    };
  }

  // 3) 상세 정보 생성 및 스트림
  const { stream } = generateTrackDetail.stream({
    track: { trackId, title, album, artist: artists.join(", ") },
    lyrics: { lyrics, lyricsProvider },
    config: { language, model },
  });
  for await (const chunk of stream) yield chunk;
}
