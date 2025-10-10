import { ActivityIndicator, Text, View } from "react-native";

import { colors } from "@/constants/colors";

import { styles } from "./LyricsGeneratingIndicator.styles";

export default function LyricsGeneratingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={24} color={colors.onBackground} />
      <Text style={styles.message}>AI가 열심히 가사를 해석하고 있어요.</Text>
    </View>
  );
}
