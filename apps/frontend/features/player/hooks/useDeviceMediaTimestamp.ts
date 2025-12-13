import { useState, useEffect, useRef } from "react";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { MediaModule } from "@/core/mediaModule";

/**
 * @description
 * 기기에서 재생되는 미디어의 현재 시각을 가져오는 훅입니다.
 *
 * 반환되는 `timestamp` 상태값은 0.1초(100ms)마다 갱신되며, 재생 상태에 따라 보정됩니다.
 *
 * @returns 기기에서 재생되는 미디어의 현재 시각
 */
export default function useDeviceMediaTimestamp() {
  const { deviceMedia } = useDeviceMediaStore();
  const [timestamp, setTimestamp] = useState(0);

  const syncData = useRef({
    position: 0, // MediaModule에서 받은 마지막 위치
    syncTime: Date.now(), // 마지막 위치를 받은 로컬 시간
    isPlaying: false, // 현재 재생 상태
  });

  const isPlaying = deviceMedia?.isPlaying ?? false;

  // 보정 로직
  useEffect(() => {
    const syncWithNative = async () => {
      try {
        const position = await MediaModule.getCurrentPosition();
        // 최신 기준점을 ref에 저장
        syncData.current = {
          position: position,
          syncTime: Date.now(),
          isPlaying: isPlaying ?? false,
        };

        // 초기 로드 시 보정된 값으로 state를 업데이트
        if (!isPlaying) {
          setTimestamp(position);
        }
      } catch {
        syncData.current.isPlaying = false;
      }
    };

    syncWithNative();
    const interval = setInterval(syncWithNative, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const updateTimestamp = () => {
      // isPlaying 상태일 때만 타임스탬프를 보간
      if (syncData.current.isPlaying) {
        const elapsedTime = Date.now() - syncData.current.syncTime;
        const interpolatedTimestamp = syncData.current.position + elapsedTime;
        const sec = interpolatedTimestamp / 1000;
        setTimestamp(sec);
      }
    };

    // 0.1초(100ms)마다 타임스탬프 업데이트
    const interval = setInterval(updateTimestamp, 100);

    return () => clearInterval(interval);
  }, []);

  return timestamp;
}
