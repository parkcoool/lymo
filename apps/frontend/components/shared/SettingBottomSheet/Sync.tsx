import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/colors";
import { useSettingStore } from "@/contexts/useSettingStore";
import useTrackKey from "@/hooks/useTrackKey";

import { getSyncText } from "./SettingBottomSheet.helpers";
import { styles } from "./SettingBottomSheet.styles";

export default function Sync() {
  const { setting, updateSetting } = useSettingStore();
  const trackKey = useTrackKey();

  // 트랙 키가 없으면 아무것도 렌더링하지 않음
  if (!trackKey) return null;

  // 현재 설정된 값
  const value = setting.delayMap.get(trackKey) ?? 0;

  // 값 변경 핸들러
  const handleValueChange = (value: number) => {
    // 500 단위로 반올림
    const rounded = Math.round(value / 500) * 500;
    updateSetting((prev) => {
      const newDelayMap = new Map(prev.delayMap);
      if (trackKey) newDelayMap.set(trackKey, rounded);

      return { ...prev, delayMap: newDelayMap };
    });
  };

  const handleMinusPress = () => {
    handleValueChange(Math.max(value - 500, -10000));
  };

  const handlePlusPress = () => {
    handleValueChange(Math.min(value + 500, 10000));
  };

  return (
    <View style={styles.content}>
      {/* 설명 텍스트 */}
      <Text style={styles.syncIndicatorText}>
        {value === 0 ? "가사를 원래대로 하이라이트" : `가사를 ${getSyncText(value)} 하이라이트`}
      </Text>

      {/* 슬라이더 wrapper */}
      <View style={styles.sliderWrapper}>
        {/* 감소 버튼 */}
        <TouchableOpacity style={styles.arrowButton} onPress={handleMinusPress}>
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
        <TouchableOpacity style={styles.arrowButton} onPress={handlePlusPress}>
          <MaterialIcons name="add" size={18} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
