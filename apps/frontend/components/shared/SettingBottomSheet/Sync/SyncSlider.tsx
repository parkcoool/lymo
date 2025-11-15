import Slider from "@react-native-community/slider";

import { colors } from "@/constants/colors";

import { styles } from "./Sync.styles";

interface SyncSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export default function SyncSlider({ value, onValueChange }: SyncSliderProps) {
  return (
    <Slider
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
