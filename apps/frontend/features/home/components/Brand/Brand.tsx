import { Text, View } from "react-native";
import { styles } from "./Brand.styles";
import Logo from "./Logo";
import { colors } from "@/constants/colors";

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
