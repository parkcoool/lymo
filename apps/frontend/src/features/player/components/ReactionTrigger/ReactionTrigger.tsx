import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "./styles";

export default function ReactionTrigger() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { bottom: bottom + 20 }]}>
      <TouchableOpacity style={styles.button}>
        <MaterialIcons style={styles.icon} size={20} name="add-reaction" />
      </TouchableOpacity>
    </View>
  );
}
