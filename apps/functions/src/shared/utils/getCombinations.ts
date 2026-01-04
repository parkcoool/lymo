/**
 * 배열에서 r개의 요소를 선택하는 모든 조합을 반환합니다.
 * @param arr 조합을 만들 원본 배열
 * @param r 선택할 요소의 개수
 * @returns 모든 조합을 담은 2차원 배열
 */
export default function getCombinations<T>(arr: T[], r: number): T[][] {
  // 결과를 저장할 배열
  const results: T[][] = [];

  // r이 1이면 각 요소를 배열로 감싸서 반환
  if (r === 1) {
    return arr.map((value) => [value]);
  }

  // 배열을 순회하며 조합을 생성
  arr.forEach((fixed, index, origin) => {
    // 현재 요소를 제외한 나머지 배열
    const rest = origin.slice(index + 1);

    // 나머지 배열에서 r-1개의 조합을 재귀적으로 구함
    const combinations = getCombinations(rest, r - 1);

    // 구한 조합에 현재 요소를 추가
    const attached = combinations.map((combination) => [fixed, ...combination]);

    // 최종 결과에 추가
    results.push(...attached);
  });

  return results;
}
