import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { FallbackProps } from "react-error-boundary";
import { Text, View } from "react-native";

import { styles } from "./ErrorIndicator.styles";

export default function ErrorIndicator({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="error" size={60} style={styles.errorIcon} />
      <Text style={styles.errorMessage}>
        {error.message ?? "오류가 발생했어요."}
      </Text>
    </View>
  );
}
