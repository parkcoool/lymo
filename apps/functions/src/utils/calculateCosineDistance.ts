/**
 * 코사인 유사도를 계산하는 함수입니다.
 * @param vecA 벡터 A
 * @param vecB 벡터 B
 * @returns 코사인 거리 (0 ~ 1)
 */
export default function calculateCosineDistance(
  vecA: number[],
  vecB: number[]
): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 1; // 제로 벡터는 의미가 없으므로 최대 거리로 처리

  const similarity = dotProduct / (magnitudeA * magnitudeB);
  return 1 - similarity;
}
