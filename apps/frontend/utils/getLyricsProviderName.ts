import { LyricsProvider } from "@lymo/schemas/shared";

/**
 * @description 가사 제공자 아이디로부터 제공자 이름을 반환합니다.
 * @param lyricsProvider 가사 제공자 아이디
 * @returns 가사 제공자 이름
 */
export default function getLyricsProviderName(lyricsProvider: LyricsProvider) {
  switch (lyricsProvider) {
    case "lrclib":
      return "LRCLIB";
    default:
      return null;
  }
}
