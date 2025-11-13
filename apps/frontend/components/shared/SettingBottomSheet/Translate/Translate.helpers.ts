import { Language } from "@lymo/schemas/shared";

export const getLanguageName = (value: Language) => {
  switch (value) {
    case "en":
      return "English";
    case "ko":
      return "한국어";
  }
};
