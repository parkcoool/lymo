import { Language } from "@lymo/schemas/shared";

export default function getLanguageName(language: Language): string {
  switch (language) {
    case "en":
      return "영어";
    case "ko":
      return "한국어";
  }
}
