import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

import { useSyncStore } from "@/contexts/useSyncStore";

import { styles } from "./StartTrack.styles";

interface StartTrackProps {
  isTrackingMode: boolean;
  onPress: () => void;
}

const slideInDown = SlideInDown.springify();
const slideOutDown = SlideOutDown.springify();

export default function StartTrack({ isTrackingMode, onPress }: StartTrackProps) {
  const { isSynced } = useSyncStore();

  if (!isSynced) return null;
  if (isTrackingMode) return null;

  return (
    <Animated.View entering={slideInDown} exiting={slideOutDown} style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialIcons style={styles.icon} size={20} name="push-pin" />
      </TouchableOpacity>
    </Animated.View>
  );
}
