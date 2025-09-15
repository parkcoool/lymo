/**
 * MM:SS 형식의 기간 문자열을 초 단위로 변환합니다.
 * @param duration MM:SS 형식의 기간 문자열 (예: "2:03")
 * @returns 초 단위로 변환된 기간 (예: 123)
 */
export default function parseDuration(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length !== 2 && parts.length !== 3) {
    throw new Error("Invalid duration format");
  }
  let seconds = 0;
  if (parts.length === 3) {
    // HH:MM:SS 형식
    seconds += parts[0] * 3600; // 시간
    seconds += parts[1] * 60; // 분
    seconds += parts[2]; // 초
  } else {
    // MM:SS 형식
    seconds += parts[0] * 60; // 분
    seconds += parts[1]; // 초
  }
  return seconds;
}
