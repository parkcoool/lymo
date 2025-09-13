/**
 * ISO 8601 형식의 기간 문자열을 초 단위로 변환합니다.
 * @param duration ISO 8601 형식의 기간 문자열 (예: "PT1H2M3S")
 * @returns 초 단위로 변환된 기간 (예: 3723)
 */
export default function parseISO8601Duration(duration: string): number {
  // 정규 표현식을 사용하여 시간 단위별로 숫자를 추출합니다.
  // P(n)Y(n)M(n)DT(n)H(n)M(n)S 형식에 대응합니다.
  const regex =
    /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error("Invalid ISO 8601 duration format");
  }

  // matches 배열의 인덱스는 정규식의 캡처 그룹에 해당합니다.
  // 1: Years, 2: Months, 3: Days, 4: Hours, 5: Minutes, 6: Seconds
  const hours = parseFloat(matches[4] || "0");
  const minutes = parseFloat(matches[5] || "0");
  const seconds = parseFloat(matches[6] || "0");

  // 년(Y), 월(M), 일(D)은 길이가 가변적이므로 이 함수에서는 계산하지 않습니다.
  // 필요하다면 특정 기준(예: 1년=365일)을 정하고 추가해야 합니다.
  if (matches[1] || matches[2] || matches[3]) {
    console.warn(
      "This function only calculates H, M, S components. Y, M, D are ignored."
    );
  }

  // 총 초를 계산하여 반환합니다.
  return hours * 3600 + minutes * 60 + seconds;
}
