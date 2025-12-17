import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ERROR_MESSAGES } from "@lymo/schemas/error";
import { useNavigation, type ErrorBoundaryProps } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import KnownError from "@/shared/errors/KnownError";

import { styles } from "./ErrorIndicator.styles";

export default function ErrorIndicator({ error, retry }: ErrorBoundaryProps) {
  const navigation = useNavigation();

  let message = "알 수 없는 오류가 발생했어요.";

  if (error instanceof KnownError) {
    if (error.message.length > 0) message = error.message;
    message = ERROR_MESSAGES[error.code] ?? message;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="error" size={60} style={styles.errorIcon} />
        <Text style={styles.errorMessage}>{message}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <MaterialIcons name="home" size={20} style={styles.buttonIcon} />
          <Text style={styles.buttonContent}>홈으로</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={retry}>
          <MaterialIcons name="refresh" size={20} style={styles.buttonIcon} />
          <Text style={styles.buttonContent}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
