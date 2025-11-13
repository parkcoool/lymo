import { Lyrics } from "@lymo/schemas/shared";

interface ProcessLyricsProps {
  rawLyrics: { text: string; start: number; end: number }[];
  lyricsSplitIndices: number[];
  translations: (string | null)[];
  paragraphSummaries: (string | null)[];
}

/**
 * @description 주어진 가사 데이터를 가사 문단 및 문장 구조로 처리합니다.
 * @param rawLyrics 원본 가사 배열
 * @param lyricsSplitIndices 문단 구분 인덱스 배열
 * @param translations 문장별 번역 배열
 * @param paragraphSummaries 문단별 요약 배열
 * @returns 처리된 가사 구조
 */
export default function processLyrics({
  rawLyrics,
  lyricsSplitIndices,
  translations,
  paragraphSummaries,
}: ProcessLyricsProps): Lyrics {
  // 전체 가사를 문단별로 나누기
  const paragraphBoundaries = [0, ...lyricsSplitIndices, rawLyrics.length];
  const lyrics: Lyrics = [];

  for (let p = 0; p < paragraphBoundaries.length - 1; p++) {
    const startIdx = paragraphBoundaries[p];
    const endIdx = paragraphBoundaries[p + 1];

    // 각 문단의 문장들 구성
    const sentences = rawLyrics.slice(startIdx, endIdx).map((lyric, idx) => {
      const globalIdx = startIdx + idx;
      return {
        text: lyric.text,
        translation: translations[globalIdx] ?? null,
        start: lyric.start,
        end: lyric.end,
      };
    });

    lyrics.push({
      sentences,
      summary: paragraphSummaries[p] ?? null,
    });
  }

  return lyrics;
}
