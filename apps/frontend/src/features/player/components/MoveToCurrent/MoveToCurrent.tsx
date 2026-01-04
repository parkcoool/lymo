import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, Text, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "./styles";

interface MoveToCurrentProps {
  activeSentenceY: number;
  onPress: () => void;
  height: number;
}

const slideInDown = SlideInDown.springify();
const slideOutDown = SlideOutDown.springify();

export default function MoveToCurrent({ activeSentenceY, onPress, height }: MoveToCurrentProps) {
  const { bottom } = useSafeAreaInsets();

  const scrollDirection =
    activeSentenceY < 0 ? "up" : activeSentenceY + 100 > height ? "down" : null;

  return (
    <View style={[styles.wrapper, { bottom: bottom + 20 }]}>
      <Animated.View entering={slideInDown} exiting={slideOutDown}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <MaterialIcons
            style={styles.icon}
            size={20}
            name={scrollDirection === "up" ? "arrow-upward" : "arrow-downward"}
          />
          <Text style={styles.text}>현재 가사로 이동</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
