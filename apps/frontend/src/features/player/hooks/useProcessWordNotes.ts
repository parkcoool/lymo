import { BaseStoryFields, GeneratedStoryFields, Track } from "@lymo/schemas/doc";
import { useMemo } from "react";

import groupWordNotesIntoSections from "../utils/groupWordNotesIntoSections";

interface UseProcessWordNotesParams {
  track?: Track;
  story?: BaseStoryFields & Partial<GeneratedStoryFields>;
}

/**
 * 처리된 단어 해석을 반환하는 훅입니다.
 * 반환하는 단어 해석은 섹션별로 그룹화되어 있고, 각 단어 해석의 lyricsIndex는 섹션 내 가사 인덱스로 변환됩니다.
 * @returns 섹션별로 그룹화된 단어 해석 목록 (2차원 배열)
 */
export default function useProcessWordNotes({ track, story }: UseProcessWordNotesParams) {
  return useMemo(() => {
    if (!track) return;

    // 해석 정보가 없는 경우
    if (!story || !story.sectionBreaks) {
      const lyrics = Object.values(track.lyrics)[0];
      if (!lyrics) return;

      return groupWordNotesIntoSections({
        wordNotes: story?.wordNotes,
        sectionBreaks: story?.sectionBreaks,
        lyricsLength: lyrics.length,
      });
    }

    // 해석 정보가 있는 경우
    else {
      // 가사 관련 데이터가 모두 존재하는지 검증
      const lyrics = track.lyrics[story.lyricsProvider];
      const { wordNotes, sectionBreaks } = story;
      if (lyrics === undefined) return;

      return groupWordNotesIntoSections({
        wordNotes,
        sectionBreaks,
        lyricsLength: lyrics.length,
      });
    }
  }, [track, story]);
}
