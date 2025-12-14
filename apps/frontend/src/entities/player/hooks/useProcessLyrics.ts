import { BaseStoryFields, GeneratedStoryFields, Track } from "@lymo/schemas/doc";
import { useMemo } from "react";

import groupLyricsIntoSections from "../utils/groupLyricsIntoSections";

interface UseProcessLyricsParams {
  track?: Track;
  story?: BaseStoryFields & Partial<GeneratedStoryFields>;
}

/**
 * 처리된 가사를 반환하는 훅입니다.
 * 반환된 가사는 문단으로 나누어져 있으며, 문단 해석과 가사 해석이 포함됩니다.
 * @returns 처리된 가사 데이터
 */
export default function useProcessLyrics({ track, story }: UseProcessLyricsParams) {
  return useMemo(() => {
    if (!track) return;

    // 해석 정보가 없는 경우
    if (!story || (!story.lyricTranslations && !story.sectionBreaks && !story.sectionNotes)) {
      const lyrics = Object.values(track.lyrics)[0];
      if (!lyrics) return;

      // 가사 처리
      return groupLyricsIntoSections({
        lyrics,
        sectionBreaks: [],
        lyricTranslations: [],
        sectionNotes: [],
      });
    }

    // 해석 정보가 있는 경우
    else {
      // 가사 관련 데이터가 모두 존재하는지 검증
      const lyrics = track.lyrics[story.lyricsProvider];
      const { sectionBreaks, lyricTranslations, sectionNotes } = story;
      if (lyrics === undefined) return;

      // 가사 처리
      return groupLyricsIntoSections({ lyrics, sectionBreaks, lyricTranslations, sectionNotes });
    }
  }, [track, story]);
}
