import { BaseStoryFields, GeneratedStoryFields, Track } from "@lymo/schemas/doc";
import { useMemo } from "react";

import groupLyricsIntoSections from "@/utils/groupLyricsIntoSections";

interface UseProcessLyricsParams {
  track?: Track;
  story?: BaseStoryFields & Partial<GeneratedStoryFields>;
}

export default function useProcessLyrics({ track, story }: UseProcessLyricsParams) {
  return useMemo(() => {
    if (!track) return;

    // 해석 정보가 없는 경우
    if (!story || !story.lyricTranslations || !story.sectionBreaks || !story.sectionNotes) {
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
      if (
        lyrics === undefined ||
        sectionBreaks === undefined ||
        lyricTranslations === undefined ||
        sectionNotes === undefined
      )
        return;

      // 가사 처리
      return groupLyricsIntoSections({ lyrics, sectionBreaks, lyricTranslations, sectionNotes });
    }
  }, [track, story]);
}
