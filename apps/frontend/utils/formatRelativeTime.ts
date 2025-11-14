/**
 * ISO 8601 날짜 문자열을 상대적인 시간 형식으로 변환합니다.
 * @param dateString - ISO 8601 형식의 날짜 문자열 (예: "2024-11-06T12:00:00.000Z")
 * @returns "방금", "n분", "n시간", "n일", "n달", "n년"
 * @example
 * formatRelativeTime("2024-11-06T12:00:00.000Z") // "5시간"
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "방금";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간`;
  } else if (diffInDays < 30) {
    return `${diffInDays}일`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}달`;
  } else {
    return `${diffInYears}년`;
  }
}
