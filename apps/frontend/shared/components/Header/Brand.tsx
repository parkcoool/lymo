import { Text, View } from "react-native";

import { colors } from "@/shared/constants/colors";

import Logo from "./Logo";
import { styles } from "./styles";

export default function Brand() {
  return (
    <View style={styles.brandWrapper}>
      <View style={styles.logoWrapper}>
        <Logo fill={colors.onBackground} />
      </View>
      <Text style={styles.brandText}>Lymo</Text>
    </View>
  );
}
