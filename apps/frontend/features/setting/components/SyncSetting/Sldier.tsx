import OriginalSlider from "@react-native-community/slider";

import { colors } from "@/shared/constants/colors";

import { styles } from "./styles";

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export default function Slider({ value, onValueChange }: SliderProps) {
  return (
    <OriginalSlider
      minimumValue={-10000}
      maximumValue={10000}
      step={100}
      value={value}
      onValueChange={onValueChange}
      style={styles.slider}
      maximumTrackTintColor={colors.onBackground}
      thumbTintColor={colors.onSurface}
      minimumTrackTintColor={colors.onSurface}
    />
  );
}
