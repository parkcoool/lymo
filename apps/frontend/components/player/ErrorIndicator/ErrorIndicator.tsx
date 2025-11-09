import { Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { styles } from "./ErrorIndicator.styles";

interface ErrorIndicatorProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorIndicator({
  message,
  onRetry,
}: ErrorIndicatorProps) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="error" size={60} style={styles.errorIcon} />
      <Text style={styles.errorMessage}>{message ?? "오류가 발생했어요."}</Text>
    </View>
  );
}
