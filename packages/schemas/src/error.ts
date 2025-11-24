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
]);
export const ERROR_CODES = errorCode.enum;
export type ErrorCode = z.infer<typeof errorCode>;
