import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress?: () => void;
}

export default function SettingItem({ icon, title, description, onPress }: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <View>{icon}</View>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View>
        <MaterialIcons name="chevron-right" style={styles.icon} size={24} />
      </View>
    </TouchableOpacity>
  );
}
