import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View } from "react-native";

import { styles } from "../SettingBottomSheet.styles";

import SyncSlider from "./SyncSlider";

interface SyncControllerProps {
  value: number;
  onValueChange: (value: number) => void;
  onMinusPress: () => void;
  onMinusLongPress: () => void;
  onPlusPress: () => void;
  onPlusLongPress: () => void;
  onPressOut: () => void;
}

export default function SyncController({
  value,
  onValueChange,
  onMinusPress,
  onMinusLongPress,
  onPlusPress,
  onPlusLongPress,
  onPressOut,
}: SyncControllerProps) {
  return (
    <View style={styles.controller} collapsable={false}>
      {/* 감소 버튼 */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={onMinusPress}
        onLongPress={onMinusLongPress}
        onPressOut={onPressOut}
      >
        <MaterialIcons name="remove" size={18} style={styles.arrowIcon} />
      </TouchableOpacity>

      {/* 슬라이더 */}
      <SyncSlider value={value} onValueChange={onValueChange} />

      {/* 증가 버튼 */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={onPlusPress}
        onLongPress={onPlusLongPress}
        onPressOut={onPressOut}
      >
        <MaterialIcons name="add" size={18} style={styles.arrowIcon} />
      </TouchableOpacity>
    </View>
  );
}
