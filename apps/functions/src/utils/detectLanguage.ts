import { Language } from "@lymo/schemas/shared";
import { franc } from "franc-min";

/**
 * 텍스트의 언어를 감지하여 Language 타입으로 반환합니다.
 * @param text 언어를 감지할 텍스트
 * @returns 감지된 언어 (Language 타입) 또는 null (감지 실패 시)
 */
export default function detectLanguage(text: string): Language | null {
  // franc는 ISO 639-3 코드를 반환 (예: "eng", "kor")
  const detected = franc(text, { minLength: 3 });

  // franc의 결과를 Language 타입으로 매핑
  switch (detected) {
    case "eng": // English
      return "en";
    case "kor": // Korean
      return "ko";
    case "und": // 감지 불가
      return null;
    default:
      // 지원하지 않는 언어는 null 반환
      return null;
  }
}
