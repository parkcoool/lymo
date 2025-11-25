import { Track } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import { Language } from "@lymo/schemas/shared";

import { generateStoryFlow } from "../../flows/generateStory";
import { createStoryDoc } from "../../tools/createStoryDoc";
import { getStoryFromDB } from "../../tools/getStoryDoc";

import { StoryUpdater } from "./utils";

interface SaveGeneratedStoryParams {
  track: Track;
  trackId: string;
  language: Language;
}

/**
 * 봇 계정으로 곡 해석을 생성하고 Firestore에 저장합니다.
 *
 * 이미 해당 언어의 봇 곡 해석이 존재하면 생성을 건너뜁니다.
 *
 * @param params - 곡 해석 생성 파라미터
 * @param params.track - 곡 정보
 * @param params.trackId - Firestore 곡 문서 ID
 * @param params.language - 생성할 곡 해석의 언어
 *
 * @returns 곡 해석이 새로 생성되었으면 `true`, 이미 존재하면 `false`
 */
export async function ensureDefaultStory({ track, trackId, language }: SaveGeneratedStoryParams) {
  // 1) DB에서 default story 문서 가져오기
  const storyQuery = await getStoryFromDB({ trackId, language, userId: "bot" });
  if (storyQuery) return storyQuery.id;

  // 2) 가사 제공자 결정하기
  const lyricsProvider = Object.keys(track.lyrics)[0] as keyof typeof track.lyrics | undefined;
  if (!lyricsProvider) throw new Error(ERROR_CODES.LYRICS_NOT_FOUND);

  // 3) story 문서 생성하기
  const stroyDocId = await createStoryDoc({
    trackInfo: {
      trackId,
      trackTitle: track.title,
      trackAlbum: track.album,
      trackAlbumArt: track.albumArt,
      trackArtists: track.artists,
    },

    userInfo: {
      userId: "bot",
      userName: "__BOT__",
      userAvatar: null,
    },

    config: { language, lyricsProvider },
  });
  if (!stroyDocId) throw new Error(ERROR_CODES.STORY_SAVE_FAILED);

  // 4) StoryUpdater 인스턴스 생성
  const storyUpdater = new StoryUpdater(stroyDocId);

  // 5) generateStoryFlow 실행
  const { stream, output } = generateStoryFlow.stream({
    track,
    config: { lyricsProvider, language },
  });

  // 6) 스트림 및 최종 결과 처리
  for await (const chunk of stream) await storyUpdater.update(chunk);
  await storyUpdater.complete(await output);
  return stroyDocId;
}
