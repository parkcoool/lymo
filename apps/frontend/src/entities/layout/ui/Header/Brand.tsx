import { Text, View } from "react-native";

import Logo from "@/shared/components/Logo";
import { colors } from "@/shared/constants/colors";

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
