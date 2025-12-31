import { useState, useEffect } from "react";

import { MediaModule } from "@/core/mediaModule";
import { useDeviceMediaStore } from "@/entities/deviceMedia/models/deviceMediaStore";
import useTimestampDelayInSeconds from "@/entities/player/hooks/useTimestampDelay";

/**
 * 기기에서 재생되는 미디어의 현재 시각을 바탕으로 현재 보여줄 반응 bucket의 인덱스를 반환하는 훅입니다.
 *
 * @return 현재 활성화된 반응 bucket의 인덱스
 */
export default function useActiveBucketIndex() {
  const { deviceMedia } = useDeviceMediaStore();
  const isPlaying = deviceMedia?.isPlaying ?? false;
  const delayInSeconds = useTimestampDelayInSeconds();

  const [index, setIndex] = useState<number>();

  useEffect(() => {
    if (!isPlaying) return;

    const updateTimestamp = async () => {
      if (!isPlaying) return;

      const timestamp = (await MediaModule.getCurrentPosition()) / 1000;

      // 상태값 업데이트
      const index = Math.floor(timestamp / 5);
      setIndex(index);
    };

    updateTimestamp();
    const interval = setInterval(updateTimestamp, 100);

    return () => clearInterval(interval);
  }, [delayInSeconds, isPlaying]);

  return index;
}
