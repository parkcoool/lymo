import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/colors";

import { styles } from "./SettingBottomSheet.styles";

interface MainProps {
  value: number;
  onChange: (value: number) => void;
}

export default function Sync({ value, onChange }: MainProps) {
  const handleChange = (value: number) => {
    // 0.5 단위로 반올림
    const rounded = Math.round(value * 2) / 2;
    onChange(rounded);
  };

  const handleMinusPress = () => {
    handleChange(Math.max(value - 0.5, -10));
  };

  const handlePlusPress = () => {
    handleChange(Math.min(value + 0.5, 10));
  };

  return (
    <View style={styles.content}>
      <Text style={styles.syncIndicatorText}>
        {value === 0
          ? "가사를 원래대로 하이라이트"
          : `가사를 ${Math.abs(value)}초 ${
              value > 0 ? "느리게" : "빠르게"
            } 하이라이트`}
      </Text>
      <View style={styles.sliderWrapper}>
        <TouchableOpacity style={styles.arrowButton} onPress={handleMinusPress}>
          <MaterialIcons name="remove" size={18} style={styles.arrowIcon} />
        </TouchableOpacity>
        <Slider
          minimumValue={-10}
          maximumValue={10}
          step={0.5}
          value={value}
          onValueChange={handleChange}
          style={styles.slider}
          thumbTintColor={colors.surface}
          minimumTrackTintColor={colors.surface}
        />
        <TouchableOpacity style={styles.arrowButton} onPress={handlePlusPress}>
          <MaterialIcons name="add" size={18} style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
