/**
 * 초를 "분:초" 형식의 문자열로 변환합니다.
 * @param seconds - 변환할 초.
 * @returns "분:초" 형식으로 포맷된 문자열.
 */
export default function convertSecondsToString(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${minutes}:${formattedSeconds}`;
}
