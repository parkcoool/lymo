import { Language } from "@lymo/schemas/shared";

export const getSyncText = (syncDelay: number) =>
  syncDelay === 0 ? "" : `${Math.abs(syncDelay / 1000)}초 ${syncDelay < 0 ? "느리게" : "빠르게"}`;

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
