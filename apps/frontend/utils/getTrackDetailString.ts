interface GetTrackDetailStringProps {
  artist: string;
  album: string | null;
  publishedAt: string | null;
}

/**
 * @description 트랙의 상세 정보를 문자열로 반환합니다.
 * @param GetTrackDetailStringProps 트랙의 상세 정보
 * @returns 트랙의 상세 정보를 결합한 문자열
 */
export default function getTrackDetailString({
  artist,
  album,
  publishedAt,
}: GetTrackDetailStringProps) {
  const year = publishedAt ? new Date(publishedAt).getFullYear() : null;
  return [artist, album, year].filter(Boolean).join(" • ");
}
