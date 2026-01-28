import z from "zod";

export const errorCode = z.enum([
  // 외부 API에서 곡 정보를 검색하는 데 실패한 경우
  "EXTERNAL_TRACK_NOT_FOUND",

  // 외부 API에서 가사 정보를 검색하는 데 실패한 경우
  "EXTERNAL_LYRICS_NOT_FOUND",

  // DB에서 곡 정보를 찾을 수 없는 경우
  "TRACK_NOT_FOUND",

  // DB에서 해석 정보를 찾을 수 없는 경우
  "STORY_NOT_FOUND",

  // DB에서 가사 정보를 찾을 수 없는 경우
  "LYRICS_NOT_FOUND",

  // AI 생성이 실패한 경우
  "AI_GENERATION_FAILED",

  // 해석 정보를 DB에 저장하는 데 실패한 경우
  "STORY_SAVE_FAILED",

  // 곡 정보를 DB에 저장하는 데 실패한 경우
  "TRACK_SAVE_FAILED",

  // 잘못된 입력이 제공된 경우
  "INVALID_INPUT",

  // 가사 제공자를 찾을 수 없는 경우
  "LYRICS_PROVIDER_NOT_FOUND",

  // 인증되지 않은 경우
  "UNAUTHORIZED",
]);
export const ERROR_CODES = errorCode.enum;
export type ErrorCode = z.infer<typeof errorCode>;

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  EXTERNAL_TRACK_NOT_FOUND: "곡 정보 검색 결과가 없습니다.",
  EXTERNAL_LYRICS_NOT_FOUND: "가사 정보 검색 결과가 없습니다.",
  TRACK_NOT_FOUND: "곡 정보를 찾을 수 없습니다.",
  STORY_NOT_FOUND: "해석 정보를 찾을 수 없습니다.",
  LYRICS_NOT_FOUND: "가사 정보를 찾을 수 없습니다.",
  AI_GENERATION_FAILED: "AI 생성에 실패했습니다.",
  STORY_SAVE_FAILED: "해석 정보를 저장하는 데 실패했습니다.",
  TRACK_SAVE_FAILED: "곡 정보를 저장하는 데 실패했습니다.",
  INVALID_INPUT: "잘못된 입력이 제공되었습니다.",
  LYRICS_PROVIDER_NOT_FOUND: "가사 제공자를 찾을 수 없습니다.",
  UNAUTHORIZED: "로그인이 필요합니다.",
};
