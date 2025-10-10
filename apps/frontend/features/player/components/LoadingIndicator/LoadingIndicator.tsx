import { ActivityIndicator, View } from "react-native";

import { colors } from "@/constants/colors";

import { styles } from "./LoadingIndicator.styles";

export default function LoadingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={60} color={colors.onBackground} />
    </View>
  );
}
