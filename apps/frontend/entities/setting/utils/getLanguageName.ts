import { Language } from "@lymo/schemas/shared";

export default function getLanguageName(language: Language): string {
  switch (language) {
    case "en":
      return "English";
    case "ko":
      return "Korean";
  }
}
