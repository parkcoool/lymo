import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { FallbackProps } from "react-error-boundary";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./ErrorIndicator.styles";

export default function ErrorIndicator({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="error" size={60} style={styles.errorIcon} />
        <Text style={styles.errorMessage}>
          {error.message ?? "오류가 발생했어요."}
        </Text>
      </View>

      <TouchableOpacity style={styles.retryButton} onPress={resetErrorBoundary}>
        <MaterialIcons
          name="refresh"
          size={20}
          style={styles.retryButtonIcon}
        />
        <Text style={styles.retryButtonContent}>다시 시도</Text>
      </TouchableOpacity>
    </View>
  );
}
