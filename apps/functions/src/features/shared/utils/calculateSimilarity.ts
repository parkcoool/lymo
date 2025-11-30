import { distance } from "fastest-levenshtein";

/**
 * Levenshtein 거리를 0과 1 사이의 유사도 점수로 변환합니다.
 * @param str1 비교할 첫 번째 문자열
 * @param str2 비교할 두 번째 문자열
 * @returns 0과 1 사이의 유사도 점수
 */
export default function calculateSimilarity(
  str1: string,
  str2: string
): number {
  const editDistance = distance(str1, str2);
  const longerLength = Math.max(str1.length, str2.length);

  if (longerLength === 0) {
    return 1; // 두 문자열이 모두 비어있으면 완전히 동일하다고 간주
  }

  return 1 - editDistance / longerLength;
}
