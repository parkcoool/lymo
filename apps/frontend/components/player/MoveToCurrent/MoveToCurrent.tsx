import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, TouchableOpacity, Text } from "react-native";

import useWindowSize from "@/hooks/useWindowSize";

import { styles } from "./MoveToCurrent.styles";

interface MoveToCurrentProps {
  activeSentenceY: number;
  onPress: () => void;
}

export default function MoveToCurrent({
  activeSentenceY,
  onPress,
}: MoveToCurrentProps) {
  const { height } = useWindowSize();

  const scrollDirection =
    activeSentenceY < 0 ? "up" : activeSentenceY + 100 > height ? "down" : null;

  if (scrollDirection === null) return;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <MaterialIcons
          style={styles.icon}
          size={20}
          name={scrollDirection === "up" ? "arrow-upward" : "arrow-downward"}
        />
        <Text style={styles.text}>현재 가사로 이동</Text>
      </TouchableOpacity>
    </View>
  );
}
