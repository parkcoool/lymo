import { TrackSource } from "@/contexts/useTrackSourceStore";
import { Language } from "@/types/setting";

export const getSyncText = (syncDelay: number) =>
  syncDelay === 0
    ? ""
    : `${syncDelay / 1000}초 ${syncDelay > 0 ? "느리게" : "빠르게"} `;

export const getLanguageString = (translateTargetLanguage: Language) => {
  switch (translateTargetLanguage) {
    case "ko":
      return "한국어";
    case "en":
      return "영어";
    default:
      return "알 수 없음";
  }
};

/**
 * `TrackSource`에 따라 고유한 곡 키를 반환하는 함수입니다.
 * @param trackSource 트랙 출처 객체
 * @returns 곡 키 문자열
 */
export const getTrackKey = (trackSource: TrackSource) => {
  if (trackSource.from === "device")
    return `${trackSource.track.title}-${trackSource.track.artist}`;
  else return trackSource.track.id;
};
