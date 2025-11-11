import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View, Vibration } from "react-native";

import { colors } from "@/constants/colors";
import { useSettingStore } from "@/contexts/useSettingStore";
import useTrackKey from "@/hooks/useTrackKey";

import { getSyncText } from "./SettingBottomSheet.helpers";
import { styles } from "./SettingBottomSheet.styles";

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

  return (
    <View style={styles.content}>
      {/* 설명 텍스트 */}
      <Text style={styles.syncIndicatorText}>
        {value === 0 ? "가사를 원래대로 하이라이트" : `가사를 ${getSyncText(value)} 하이라이트`}
      </Text>

      <View style={styles.bottom}>
        {/* 조작부 */}
        <View style={styles.controller} collapsable={false}>
          {/* 감소 버튼 */}
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleMinusPress}
            onLongPress={handleMinusLongPressIn}
            onPressOut={handleLongPressOut}
          >
            <MaterialIcons name="remove" size={18} style={styles.arrowIcon} />
          </TouchableOpacity>

          {/* 슬라이더 */}
          <Slider
            minimumValue={-10000}
            maximumValue={10000}
            step={100}
            value={value}
            onValueChange={handleValueChange}
            style={styles.slider}
            thumbTintColor={colors.surface}
            minimumTrackTintColor={colors.surface}
          />

          {/* 증가 버튼 */}
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handlePlusPress}
            onLongPress={handlePlusLongPressIn}
            onPressOut={handleLongPressOut}
          >
            <MaterialIcons name="add" size={18} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        {/* 초기화 버튼 */}
        <View style={styles.resetButtonWrapper}>
          <TouchableOpacity style={styles.resetButton} onPress={() => handleValueChange(0)}>
            <Text style={styles.resetButtonText}>원래대로</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// 값 계산 헬퍼
const calculateNewValue = (value: number, direction: -1 | 1) => {
  if (direction === -1) {
    return Math.max(value - 100, -10000);
  } else {
    return Math.min(value + 100, 10000);
  }
};
