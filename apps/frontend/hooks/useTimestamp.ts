import { useState, useEffect, useRef } from "react";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { MediaModule } from "@/core/mediaModule";

export default function useTimestamp(enabled: boolean) {
  const { deviceMedia } = useDeviceMediaStore();
  const [timestamp, setTimestamp] = useState(0);

  const syncData = useRef({
    position: 0, // MediaModule에서 받은 마지막 위치
    syncTime: Date.now(), // 마지막 위치를 받은 로컬 시간
    isPlaying: false, // 현재 재생 상태
  });

  const animationFrameId = useRef<number>(0);

  // 보정 로직
  useEffect(() => {
    if (!enabled) return;

    const syncWithNative = async () => {
      try {
        const position = await MediaModule.getCurrentPosition();
        // 최신 기준점을 ref에 저장
        syncData.current = {
          position: position,
          syncTime: Date.now(),
          isPlaying: deviceMedia?.isPlaying ?? false,
        };

        // 초기 로드 시 보정된 값으로 state를 업데이트
        if (!deviceMedia?.isPlaying) {
          setTimestamp(position);
        }
      } catch {
        syncData.current.isPlaying = false;
      }
    };

    syncWithNative();
    const interval = setInterval(syncWithNative, 1000);

    return () => clearInterval(interval);
  }, [enabled, deviceMedia?.isPlaying]);

  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      // isPlaying 상태일 때만 타임스탬프를 보간
      if (syncData.current.isPlaying) {
        const elapsedTime = Date.now() - syncData.current.syncTime;
        const interpolatedTimestamp = syncData.current.position + elapsedTime;
        const sec = interpolatedTimestamp / 1000;
        setTimestamp(sec);
      }
      // 다음 프레임에 animate 함수를 다시 호출
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // 애니메이션 루프 시작
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [enabled]);

  return timestamp;
}
