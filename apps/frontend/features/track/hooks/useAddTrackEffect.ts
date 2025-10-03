import { useEffect } from "react";

import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";
import type { Lyrics } from "@lymo/schemas/shared";

import addTrack from "../apis/addTrack";

interface UseAddActiveTrackEffectProps {
  enabled?: boolean;
}

export default function useAddActiveTrackEffect({
  enabled = true,
}: UseAddActiveTrackEffectProps) {
  const { track, isSynced, setTrack } = useActiveTrackStore();

  useEffect(() => {
    if (!enabled || !isSynced) return;
    if (!track || !track.title || !track.artist || !track.duration) return;

    const stream = addTrack({
      title: track.title,
      artist: track.artist,
      duration: track.duration,
    });

    const processStream = async () => {
      setTrack({
        summary: "",
        lyrics: [],
      });

      for await (const event of stream) {
        switch (event.event) {
          // 곡 메타데이터 업데이트
          case "metadata_update": {
            setTrack(event.data);
            break;
          }

          // 가사 문장 설정
          case "lyrics_set": {
            setTrack((prev) => {
              const newTrack = { ...prev };
              if (newTrack.lyrics === undefined) newTrack.lyrics = [];

              const sentence = getSentenceByIndices(
                newTrack.lyrics,
                event.data.paragraphIndex,
                event.data.sentenceIndex
              );
              sentence.text = event.data.text;
              // sentence.start = event.data.start;
              // sentence.end = event.data.end;

              return newTrack;
            });
            break;
          }

          // 가사 문장 번역 설정
          case "translation_set": {
            setTrack((prev) => {
              const newTrack = { ...prev };
              if (newTrack.lyrics === undefined) newTrack.lyrics = [];

              const sentence = getSentenceByIndices(
                newTrack.lyrics,
                event.data.paragraphIndex,
                event.data.sentenceIndex
              );
              sentence.translation = event.data.text;

              return newTrack;
            });
            break;
          }

          // 곡 요약 설정
          case "summary_append": {
            setTrack((prev) => {
              const newTrack = { ...prev };
              if (newTrack.summary === undefined) newTrack.summary = "";
              newTrack.summary += event.data;
              return newTrack;
            });
            break;
          }

          // 문단 요약 이어쓰기
          case "paragraph_summary_append": {
            setTrack((prev) => {
              const newTrack = { ...prev };
              if (newTrack.lyrics === undefined) newTrack.lyrics = [];

              const paragraph = getParagraphByIndex(
                newTrack.lyrics,
                event.data.paragraphIndex
              );
              if (paragraph.summary === null) paragraph.summary = "";
              paragraph.summary += event.data.summary;

              return newTrack;
            });
            break;
          }
        }
      }
    };

    processStream();
  }, [track, enabled, isSynced]);
}

const getParagraphByIndex = (lyrics: Lyrics, paragraphIndex: number) => {
  while (lyrics.length <= paragraphIndex) {
    lyrics.push({
      summary: "",
      sentences: [],
    });
  }

  const paragraph = lyrics[paragraphIndex];
  return paragraph;
};

const getSentenceByIndices = (
  lyrics: Lyrics,
  paragraphIndex: number,
  sentenceIndex: number
) => {
  const paragraph = getParagraphByIndex(lyrics, paragraphIndex);

  while (paragraph.sentences.length <= sentenceIndex) {
    paragraph.sentences.push({
      text: "",
      translation: "",
      start: 0,
      end: 0,
    });
  }
  const sentence = paragraph.sentences[sentenceIndex];
  return sentence;
};
