import { LLMModel } from "@lymo/schemas/shared";

export default function getProviderNameFromLLMModel(model: LLMModel) {
  switch (model) {
    case "googleai/gemini-2.5-flash":
      return "Gemini 2.5 Flash";
    case "googleai/gemini-2.5-flash-lite":
      return "Gemini 2.5 Flash Lite";
  }
}
