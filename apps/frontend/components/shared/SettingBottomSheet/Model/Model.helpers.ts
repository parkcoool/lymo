import { LLMModel } from "@lymo/schemas/shared";

export const getProviderNameFromLLMModel = (model: LLMModel) => {
  switch (model) {
    case "gemini-2.5-flash":
      return "Gemini 2.5 Flash";
    case "gemini-2.5-flash-lite":
      return "Gemini 2.5 Flash Lite";
  }
};
