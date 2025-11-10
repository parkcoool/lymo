import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, View } from "react-native";

import { styles } from "./SettingBottomSheet.styles";

interface SettingToggleProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  content?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function SettingToggle({
  icon,
  label,
  content,
  value,
  onValueChange,
}: SettingToggleProps) {
  return (
    <View style={styles.actionButton}>
      <View style={styles.actionButtonLeft}>
        <MaterialIcons name={icon} size={24} style={styles.actionButtonIcon} />
        <Text style={styles.actionButtonText}>{label}</Text>
      </View>
      <View style={styles.actionButtonRight}>{/* TODO: 토글 */}</View>
    </View>
  );
}
