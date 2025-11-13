import { LLMModel } from "@lymo/schemas/shared";

/**
 * @description LLM 모델명으로부터 제공자 아이디를 반환합니다.
 * @param model LLM 모델명
 * @returns 제공자 아이디
 */
export default function getProviderIdFromLLMModel(model: LLMModel) {
  switch (model) {
    case "googleai/gemini-2.5-flash":
      return "ai-gemini-2.5-flash";
    case "googleai/gemini-2.5-flash-lite":
      return "ai-gemini-2.5-flash-lite";
  }
}
