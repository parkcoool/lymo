/**
 * 주어진 2차원 배열에서 전체 인덱스 `i`에 해당하는 위치를 찾아 반환합니다.
 * @param arr 2차원 배열
 * @param i 전체 인덱스
 * @returns 바깥 및 안쪽 인덱스 객체 또는 null (범위 벗어남)
 */
export default function findIndex<T>(
  arr: T[][],
  i: number
): { outer: number; inner: number } | null {
  let currentIndex = 0;

  // 바깥쪽 배열 순회
  for (let outerIndex = 0; outerIndex < arr.length; outerIndex++) {
    const innerArray = arr[outerIndex];

    // i가 현재 내부 배열의 범위 내에 있는지 확인
    if (i < currentIndex + innerArray.length) {
      const innerIndex = i - currentIndex;
      return { outer: outerIndex, inner: innerIndex };
    }

    // 다음 배열을 위해 현재 배열의 길이를 더함
    currentIndex += innerArray.length;
  }

  // i가 배열의 총 길이를 벗어나는 경우
  return null;
}
