import { Track } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import { Language } from "@lymo/schemas/shared";

import KnownError from "@/features/shared/errors/KnownError";

import { generateStoryFlow } from "../../flows/generateStory";
import { copyStoryDoc } from "../../tools/copyStoryDoc";
import { getStoryDoc } from "../../tools/getStoryDoc";

import { StoryUpdater } from "./utils";

interface SaveGeneratedStoryParams {
  track: Track;
  trackId: string;
  requestId: string;
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
 * @param params.requestId - 요청 문서 ID
 * @param params.language - 생성할 곡 해석의 언어
 *
 * @returns 곡 해석이 새로 생성되었으면 `true`, 이미 존재하면 `false`
 */
export async function ensureDefaultStory({
  track,
  trackId,
  requestId,
  language,
}: SaveGeneratedStoryParams) {
  // 1) 이미 봇 계정의 곡 해석이 존재하는지 확인
  const story = await getStoryDoc({ trackId, language, userId: "bot" });

  // 1-1) 존재하면 복사
  if (story) {
    await copyStoryDoc({ requestId, story });
    return false;
  }

  // 2) 가사 제공자 결정하기
  const lyricsProvider = Object.keys(track.lyrics)[0] as keyof typeof track.lyrics | undefined;
  if (!lyricsProvider) throw new KnownError(ERROR_CODES.LYRICS_PROVIDER_NOT_FOUND);

  // 3) StoryUpdater 인스턴스 생성
  const storyUpdater = new StoryUpdater({
    track,
    trackId,
    requestId,
    config: { language, lyricsProvider },
  });

  // 4) generateStoryFlow 실행
  const { stream, output } = generateStoryFlow.stream({
    track,
    config: { lyricsProvider, language },
  });

  // 5) 스트림 및 최종 결과 처리
  for await (const chunk of stream) await storyUpdater.update(chunk);
  await storyUpdater.complete(await output);

  return true;
}
