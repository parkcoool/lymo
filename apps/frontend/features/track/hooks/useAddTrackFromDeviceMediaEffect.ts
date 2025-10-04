import { useEffect } from "react";
import { Alert } from "react-native";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";
import type { Lyrics } from "@lymo/schemas/shared";

import addTrack from "../apis/addTrack";

interface UseAddActiveTrackEffectProps {
  enabled?: boolean;
}

export default function useAddTrackFromDeviceMediaEffect({
  enabled = true,
}: UseAddActiveTrackEffectProps) {
  const { isSynced, setTrack } = useActiveTrackStore();
  const { data: deviceMedia } = useDeviceMediaStore();

  useEffect(() => {
    if (!enabled || !isSynced) return;
    if (
      !deviceMedia ||
      !deviceMedia.title ||
      !deviceMedia.artist ||
      !deviceMedia.duration
    )
      return;

    const stream = addTrack({
      title: deviceMedia.title,
      artist: deviceMedia.artist,
      duration: deviceMedia.duration,
    });

    const processStream = async () => {
      setTrack({
        summary: "",
        lyrics: [],
      });

      for await (const chunk of stream) {
        // 최종 결과 수신
        if (chunk.type === "result") {
          if (!chunk.data) {
            // TODO: 인터페이스 개선
            Alert.alert("곡 조회 실패", "곡을 조회하지 못했습니다.");
          } else {
            setTrack({
              id: chunk.data,
            });
          }
          break;
        }

        const { event, data } = chunk.data;
        switch (event) {
          // 곡 메타데이터 업데이트
          case "metadata_update": {
            setTrack(data);
            break;
          }

          // 가사 문장 설정
          case "lyrics_set": {
            setTrack((prev) => {
              const newTrack = { ...prev };
              if (newTrack.lyrics === undefined) newTrack.lyrics = [];

              const sentence = getSentenceByIndices(
                newTrack.lyrics,
                data.paragraphIndex,
                data.sentenceIndex
              );
              sentence.text = data.text;
              sentence.start = data.start;
              sentence.end = data.end;

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
                data.paragraphIndex,
                data.sentenceIndex
              );
              sentence.translation = data.text;

              return newTrack;
            });
            break;
          }

          // 곡 요약 설정
          case "summary_append": {
            setTrack((prev) => {
              const newTrack = { ...prev };
              if (newTrack.summary === undefined) newTrack.summary = "";
              newTrack.summary += data.summary;
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
                data.paragraphIndex
              );
              if (paragraph.summary === null) paragraph.summary = "";
              paragraph.summary += data.summary;

              return newTrack;
            });
            break;
          }
        }
      }
    };

    processStream();
  }, [deviceMedia, isSynced, enabled]);
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
