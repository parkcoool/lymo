/**
 * 숫자 배열을 0과 1 사이로 정규화합니다.
 * @param scores 숫자 배열
 * @returns 정규화된 숫자 배열
 */
export default function normalize(scores: number[]): number[] {
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  if (max === min) return scores.map(() => 0); // 모든 값이 같으면 0으로 처리
  return scores.map((score) => (score - min) / (max - min));
}
