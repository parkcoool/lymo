import { Language } from "@lymo/schemas/shared";
import { franc } from "franc-min";

/**
 * 텍스트의 언어를 감지하여 Language 타입으로 반환합니다.
 * @param text 언어를 감지할 텍스트
 * @returns 감지된 언어 (Language 타입) 또는 null (감지 실패 시)
 */
export function detectLanguage(text: string): Language | null {
  // franc는 ISO 639-3 코드를 반환 (예: "eng", "kor")
  const detected = franc(text, { minLength: 3 });

  switch (detected) {
    case "eng":
      return "en";
    case "kor":
      return "ko";
    default:
      return null;
  }
}
