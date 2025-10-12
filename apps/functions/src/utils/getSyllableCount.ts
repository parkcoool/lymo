import { syllable } from "syllable";

/**
 * 한글과 영어로 이루어진 텍스트의 음절 수를 계산합니다.
 * @param text 음절 수를 계산할 텍스트
 * @returns 텍스트의 음절 수
 */

export default function getSyllableCount(text: string): number {
  // 한글과 영어 분리
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g;
  const englishRegex = /[a-zA-Z]+/g;
  const koreanParts = text.match(koreanRegex) || [];
  const englishParts = text.match(englishRegex) || [];

  // 한글 음절 수 계산
  const koreanSyllableCount = koreanParts.reduce((acc, part) => {
    return acc + part.length;
  }, 0);
  // 영어 음절 수 계산
  const englishSyllableCount = englishParts.reduce((acc, part) => {
    return acc + syllable(part);
  }, 0);

  return koreanSyllableCount + englishSyllableCount;
}
