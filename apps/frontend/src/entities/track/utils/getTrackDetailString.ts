interface GetMetadataStringParams {
  artist?: string[] | string;
  album?: string | null;
  publishedAt?: string | null;
}

/**
 * 트랙의 메타데이터 정보를 문자열로 반환하는 함수입니다.
 */
export default function getMetadataString({ artist, album, publishedAt }: GetMetadataStringParams) {
  const artistString = Array.isArray(artist) ? artist.join(", ") : artist;
  const yearString = publishedAt ? new Date(publishedAt).getFullYear().toString() : null;

  return [artistString, album, yearString]
    .filter((value) => value && value.trim().length > 0)
    .join(" • ");
}
