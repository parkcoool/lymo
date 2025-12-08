import { searchLRCLib } from "@/features/shared/tools/searchLRCLib";
import getCombinations from "@/features/shared/utils/getCombinations";

export interface LRCLIBResult {
  lyrics: {
    start: number;
    end: number;
    text: string;
  }[];
  title: string;
  artist: string;
  album: string;
  duration: number;
}

interface GetLyricsFromLRCLIBParams {
  title: string;
  artists: string[];
  duration: number;
}

/**
 * @description LRCLIB에서 가사를 검색하는 헬퍼 함수
 * @param title 노래 제목
 * @param artists 아티스트 이름 배열
 * @param duration 노래 길이 (초)
 * @returns lyricsProvider와 가사 데이터로 구성된 객체 또는 null (가사를 찾지 못한 경우)
 */
export default async function getLyricsFromLRCLIB({
  title,
  artists,
  duration,
}: GetLyricsFromLRCLIBParams) {
  for (let r = 1; r <= artists.length; r++) {
    const artistStringCandidates = getCombinations(artists, r);

    for (const artistString of artistStringCandidates) {
      const result = await searchLRCLib({
        title: title,
        artist: artistString.join(" "),
        duration: duration,
      });

      if (result) return result;
    }
  }

  return null;
}
