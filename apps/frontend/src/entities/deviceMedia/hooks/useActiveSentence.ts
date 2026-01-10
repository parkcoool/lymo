import { useState, useEffect } from "react";

import MediaNotificationListenerModule from "modules/media-notification-listener";

import { useDeviceMediaStore } from "@/entities/deviceMedia/models/deviceMediaStore";
import useTimestampDelayInSeconds from "@/entities/player/hooks/useTimestampDelay";
import { Section } from "@/entities/player/models/types";

interface UseActiveSentenceParams {
  lyrics: Section[];
  delayInSeconds?: number;
  enabled?: boolean;
}

/**
 * 기기에서 재생되는 미디어의 현재 시각을 바탕으로 현재 하이라이트될 섹션과 가사 문장의 인덱스를 반환하는 훅입니다.
 *
 * @param lyrics 가사 데이터
 * @param enabled 활성화 여부 (기본값: true)
 *
 * @returns [현재 하이라이트된 섹션 인덱스, 현재 하이라이트된 문장 인덱스]
 */
export default function useActiveSentence({
  lyrics,
  enabled = true,
}: UseActiveSentenceParams): [number, number] {
  const { deviceMedia } = useDeviceMediaStore();
  const isPlaying = deviceMedia?.isPlaying ?? false;
  const delayInSeconds = useTimestampDelayInSeconds();

  const [activeSectionIndex, setActiveSectionIndex] = useState(-1);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);

  useEffect(() => {
    if (!isPlaying || !enabled) return;

    const updateTimestamp = async () => {
      if (!isPlaying || !enabled) return;

      const mediaSessionInfo = await MediaNotificationListenerModule.getCurrentMediaSession();
      if (!mediaSessionInfo.hasSession) return;
      const timestampInSeconds = mediaSessionInfo.position / 1000;

      // 상태값 업데이트
      const activeSectionIndex = getActiveSectionIndex(lyrics, timestampInSeconds + delayInSeconds);
      setActiveSectionIndex(activeSectionIndex);

      if (activeSectionIndex === -1) setActiveLyricIndex(-1);
      else
        setActiveLyricIndex(
          getActiveSentenceIndex(lyrics[activeSectionIndex], timestampInSeconds + delayInSeconds)
        );
    };

    updateTimestamp();
    const interval = setInterval(updateTimestamp, 100);

    return () => clearInterval(interval);
  }, [isPlaying, enabled, lyrics, delayInSeconds]);

  return [activeSectionIndex, activeLyricIndex];
}

const getActiveSectionIndex = (sections: Section[], timestamp: number): number => {
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    const start = section.lyrics.at(0)?.start;
    if (start === undefined) continue;
    const end = section.lyrics.at(-1)?.end;
    if (end === undefined) continue;

    if (start <= timestamp && timestamp <= end) return i;
  }

  return -1;
};

const getActiveSentenceIndex = (section: Section, timestamp: number): number => {
  for (let i = 0; i < section.lyrics.length; i++) {
    const lyric = section.lyrics[i];
    if (lyric.start <= timestamp && timestamp <= lyric.end) return i;
  }

  return -1;
};
