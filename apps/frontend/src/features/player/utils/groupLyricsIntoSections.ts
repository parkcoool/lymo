import { Lyric } from "@lymo/schemas/shared";

import type { Section } from "@/entities/player/models/types";

interface ProcessLyricsParams {
  lyrics: Lyric[];
  /**
   * lyrics[i]와 lyrics[i+1] 사이에 문단 구분이 있음을 의미하는 인덱스 배열
   */
  sectionBreaks?: number[];
  lyricTranslations?: (string | null)[];
  sectionNotes?: (string | null)[];
}

/**
 * 주어진 가사 데이터를 가사 문단 및 문장 구조로 처리합니다.
 * @param lyrics 원본 가사 배열
 * @param sectionBreaks 문단 구분 인덱스 배열 (각 i는 i번째와 i+1번째 문장 사이에 단락 구분이 있음을 의미)
 * @param lyricTranslations 문장별 번역 배열
 * @param sectionNotes 문단별 요약 배열
 * @returns 처리된 가사 구조
 */
export default function groupLyricsIntoSections({
  lyrics: rawLyrics,
  sectionBreaks,
  lyricTranslations,
  sectionNotes,
}: ProcessLyricsParams) {
  // groupLyrics가 반환한 인덱스(i)는 rawLyrics[i]와 rawLyrics[i+1] 사이 경계를 의미하므로
  // 이를 문단 시작 인덱스로 변환하기 위해 +1 해준다.
  const paragraphStartIndices = [0, ...(sectionBreaks ?? []).map((i) => i + 1), rawLyrics.length];
  const sections: Section[] = [];

  for (let p = 0; p < paragraphStartIndices.length - 1; p++) {
    const startIdx = paragraphStartIndices[p];
    const endIdx = paragraphStartIndices[p + 1];

    // 각 문단의 문장들 구성
    const lyrics = rawLyrics.slice(startIdx, endIdx).map((lyric, idx) => {
      const globalIdx = startIdx + idx;
      return {
        text: lyric.text,
        translation: lyricTranslations?.[globalIdx],
        start: lyric.start,
        end: lyric.end,
      };
    });

    const section: Section = { lyrics, note: sectionNotes?.[p] ?? null };
    sections.push(section);
  }

  return sections;
}
