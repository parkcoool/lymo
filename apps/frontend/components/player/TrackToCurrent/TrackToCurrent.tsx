import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

import { styles } from "./MoveToCurrent.styles";

interface MoveToCurrentProps {
  isTrackingMode: boolean;
  onPress: () => void;
}

const slideInDown = SlideInDown.springify();
const slideOutDown = SlideOutDown.springify();

export default function TrackToCurrent({
  isTrackingMode,
  onPress,
}: MoveToCurrentProps) {
  if (isTrackingMode) return null;

  return (
    <Animated.View
      entering={slideInDown}
      exiting={slideOutDown}
      style={styles.wrapper}
    >
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialIcons style={styles.icon} size={20} name="pin-drop" />
      </TouchableOpacity>
    </Animated.View>
  );
}
