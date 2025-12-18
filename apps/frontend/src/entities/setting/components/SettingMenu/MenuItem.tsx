import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";

interface MenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  content?: string;
  onPress?: () => void;
}

export default function MenuItem({ icon, label, content, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.itemWrapper} onPress={onPress}>
      <View style={styles.itemLeft}>
        <MaterialIcons name={icon} size={24} style={styles.itemIcon} />
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <View style={styles.itemRight}>
        {content && <Text style={styles.itemContent}>{content}</Text>}
        <MaterialIcons name="chevron-right" size={24} style={styles.itemRightIcon} />
      </View>
    </TouchableOpacity>
  );
}
