import { Language } from "@lymo/schemas/shared";

export default function convertLanguageTag(language: Language) {
  switch (language) {
    case "ko":
      return "Korean";
    case "en":
      return "English";
    default:
      return "English";
  }
}
