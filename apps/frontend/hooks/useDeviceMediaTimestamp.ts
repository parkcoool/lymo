import { useState, useEffect, useRef } from "react";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { MediaModule } from "@/core/mediaModule";

/**
 * @description
 * 기기에서 재생되는 미디어의 현재 시각을 가져오는 훅입니다.
 *
 * 반환되는 `timestamp` 상태값은 업데이트되는 빈도가 매우 짧으므로 사용 시 잦은 리렌러딩을 유발할 수 있음에 유의하세요.
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
  const animationFrameId = useRef<number>(0);

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
  }, []);

  return timestamp;
}
