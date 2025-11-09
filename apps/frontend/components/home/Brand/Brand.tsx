import { Text, View } from "react-native";

import { colors } from "@/constants/colors";

import { styles } from "./Brand.styles";
import Logo from "./Logo";

export default function Brand() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.logoWrapper}>
        <Logo fill={colors.onBackground} />
      </View>
      <Text style={styles.text}>Lymo</Text>
    </View>
  );
}
