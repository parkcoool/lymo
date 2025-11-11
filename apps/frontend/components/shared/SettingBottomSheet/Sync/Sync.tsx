import { useEffect, useRef } from "react";
import { Vibration, View } from "react-native";

import { useSettingStore } from "@/contexts/useSettingStore";
import useTrackKey from "@/hooks/useTrackKey";

import { styles } from "../SettingBottomSheet.styles";

import { calculateNewValue } from "./Sync.helpers";
import SyncController from "./SyncController";
import SyncIndicator from "./SyncIndicator";
import SyncResetButton from "./SyncResetButton";

export default function Sync() {
  const { setting, updateSetting } = useSettingStore();
  const trackKey = useTrackKey();

  // 롱프레스 상태를 관리하는 ref
  const intervalRef = useRef<number>(null);

  // 컴포넌트 언마운트 시 interval 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 트랙 키가 없으면 아무것도 렌더링하지 않음
  if (!trackKey) return null;

  // 현재 설정된 값
  const value = setting.delayMap.get(trackKey) ?? 0;

  const handleValueChange = (value: number) => {
    // 100 단위로 반올림
    const rounded = Math.round(value / 100) * 100;
    updateSetting((prev) => {
      const newDelayMap = new Map(prev.delayMap);
      if (trackKey) newDelayMap.set(trackKey, rounded);

      // 값이 변경될 때마다 진동
      Vibration.vibrate(2);
      return { ...prev, delayMap: newDelayMap };
    });
  };

  const createPressHandler = (direction: -1 | 1) => () => {
    handleValueChange(calculateNewValue(value, direction));
  };

  // 롱프레스 시작 핸들러
  const createLongPressInHandler = (direction: -1 | 1) => () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      updateSetting((prev) => {
        const currentValue = prev.delayMap.get(trackKey) ?? 0;
        const newValue = calculateNewValue(currentValue, direction);
        const rounded = Math.round(newValue / 100) * 100;
        const newDelayMap = new Map(prev.delayMap);
        if (trackKey) newDelayMap.set(trackKey, rounded);

        // 값이 변경될 때마다 진동
        Vibration.vibrate(2);
        return { ...prev, delayMap: newDelayMap };
      });
    }, 100);
  };

  // 롱프레스 종료 핸들러
  const handleLongPressOut = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMinusPress = createPressHandler(-1);
  const handlePlusPress = createPressHandler(1);
  const handleMinusLongPressIn = createLongPressInHandler(-1);
  const handlePlusLongPressIn = createLongPressInHandler(1);
  const handleReset = () => handleValueChange(0);

  return (
    <View style={styles.content}>
      <SyncIndicator value={value} />

      <View style={styles.bottom}>
        <SyncController
          value={value}
          onValueChange={handleValueChange}
          onMinusPress={handleMinusPress}
          onMinusLongPress={handleMinusLongPressIn}
          onPlusPress={handlePlusPress}
          onPlusLongPress={handlePlusLongPressIn}
          onPressOut={handleLongPressOut}
        />

        <SyncResetButton onPress={handleReset} />
      </View>
    </View>
  );
}
