import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./SettingBottomSheet.styles";

interface SettingButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  content?: string;
  onPress?: () => void;
}

export default function SettingButton({
  icon,
  label,
  content,
  onPress,
}: SettingButtonProps) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={styles.actionButtonLeft}>
        <MaterialIcons name={icon} size={24} style={styles.actionButtonIcon} />
        <Text style={styles.actionButtonText}>{label}</Text>
      </View>
      <View style={styles.actionButtonRight}>
        {content && <Text style={styles.actionButtonContent}>{content}</Text>}
        <MaterialIcons
          name="chevron-right"
          size={24}
          style={styles.actionButtonIcon}
        />
      </View>
    </TouchableOpacity>
  );
}
