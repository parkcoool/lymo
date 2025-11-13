import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./Sync.styles";

interface SyncResetButtonProps {
  onPress: () => void;
}

export default function SyncResetButton({ onPress }: SyncResetButtonProps) {
  return (
    <View style={styles.resetButtonWrapper}>
      <TouchableOpacity style={styles.resetButton} onPress={onPress}>
        <Text style={styles.resetButtonText}>원래대로</Text>
      </TouchableOpacity>
    </View>
  );
}
