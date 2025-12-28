import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";

import Switch from "@/shared/components/Switch";

import { styles } from "./styles";

interface ToggleItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export default function ToggleItem({ icon, label, value, onValueChange }: ToggleItemProps) {
  const handlePress = () => {
    onValueChange(!value);
  };

  return (
    <TouchableOpacity style={styles.itemWrapper} onPress={handlePress}>
      <View style={styles.itemLeft}>
        <MaterialIcons name={icon} size={24} style={styles.itemIcon} />
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <View style={styles.itemRight}>
        <Switch value={value} />
      </View>
    </TouchableOpacity>
  );
}
