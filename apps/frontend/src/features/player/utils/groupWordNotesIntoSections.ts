import { WordNote } from "@lymo/schemas/shared";

interface GroupWordNotesIntoSectionsParams {
  wordNotes?: WordNote[];
  sectionBreaks?: number[];
  lyricsLength: number;
}

/**
 * 단어 해석을 섹션별로 그룹화합니다.
 * @param wordNotes 전체 단어 해석 목록
 * @param sectionBreaks 문단 구분 인덱스 배열
 * @param lyricsLength 전체 가사 길이
 * @returns 섹션별로 그룹화된 단어 해석 목록 (2차원 배열)
 */
export default function groupWordNotesIntoSections({
  wordNotes = [],
  sectionBreaks,
  lyricsLength,
}: GroupWordNotesIntoSectionsParams): WordNote[][] {
  const paragraphStartIndices = [0, ...(sectionBreaks ?? []).map((i) => i + 1), lyricsLength];
  const sections: WordNote[][] = [];

  for (let p = 0; p < paragraphStartIndices.length - 1; p++) {
    const startIdx = paragraphStartIndices[p];
    const endIdx = paragraphStartIndices[p + 1];

    const sectionWordNotes: WordNote[] = [];

    wordNotes
      .filter((note) => note.lyricIndex >= startIdx && note.lyricIndex < endIdx)
      .forEach((note) => {
        const lyricIndex = note.lyricIndex - startIdx;
        sectionWordNotes[lyricIndex] = note;
      });

    sections.push(sectionWordNotes);
  }

  return sections;
}
