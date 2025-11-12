import { LLMModel } from "@lymo/schemas/shared";

export default function getProviderIdFromLLMModel(model: LLMModel) {
  switch (model) {
    case "googleai/gemini-2.5-flash":
      return "ai-gemini-2.5-flash";
    case "googleai/gemini-2.5-flash-lite":
      return "ai-gemini-2.5-flash-lite";
  }
}
