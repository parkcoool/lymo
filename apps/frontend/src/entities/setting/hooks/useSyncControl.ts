import { useRef, useEffect } from "react";
import { Vibration } from "react-native";

import { useSettingStore } from "@/entities/setting/models/settingStore";
import getNewSyncValue from "@/entities/setting/utils/getNewSyncValue";

export default function useSyncControl(trackId?: string) {
  const { setting, updateSetting } = useSettingStore();
  const intervalRef = useRef<number>(null);

  // 현재 값 가져오기
  const value = trackId ? setting.sync.get(trackId) ?? 0 : 0;

  // 컴포넌트 언마운트 시 interval 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const updateValue = (newValue: number) => {
    if (!trackId) return;

    const rounded = Math.round(newValue / 100) * 100;

    updateSetting((prev) => {
      const newDelayMap = new Map(prev.sync);
      if (rounded === 0) newDelayMap.delete(trackId);
      else newDelayMap.set(trackId, rounded);
      return { ...prev, sync: newDelayMap };
    });

    Vibration.vibrate(2);
  };

  // 핸들러: 단일 클릭
  const handlePress = (direction: -1 | 1) => () => {
    updateValue(getNewSyncValue(value, direction));
  };

  // 핸들러: 롱프레스 시작
  const handleLongPressIn = (direction: -1 | 1) => () => {
    stopInterval();

    updateValue(getNewSyncValue(value, direction));
    intervalRef.current = setInterval(() => {
      updateSetting((prev) => {
        if (!trackId) return prev;

        const currentVal = prev.sync.get(trackId) ?? 0;
        const nextVal = getNewSyncValue(currentVal, direction);
        const rounded = Math.round(nextVal / 100) * 100;

        const newDelayMap = new Map(prev.sync);
        newDelayMap.set(trackId, rounded);

        return { ...prev, sync: newDelayMap };
      });

      Vibration.vibrate(2);
    }, 100);
  };

  // 핸들러: 값 초기화
  const handleReset = () => updateValue(0);

  return {
    value,
    handlers: {
      onValueChange: updateValue,
      onMinusPress: handlePress(-1),
      onPlusPress: handlePress(1),
      onMinusLongPress: handleLongPressIn(-1),
      onPlusLongPress: handleLongPressIn(1),
      onPressOut: stopInterval,
      onReset: handleReset,
    },
  };
}
