import { Text, TouchableOpacity, View } from "react-native";

import Switch from "@/shared/components/Switch";

import { styles } from "./styles";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function SettingItem({
  icon,
  title,
  description,
  value,
  onValueChange,
  disabled,
}: SettingItemProps) {
  const handlePress = () => {
    onValueChange(!value);
  };

  return (
    <TouchableOpacity
      style={[styles.wrapper, disabled && styles.disabledWrapper]}
      onPress={handlePress}
      disabled={disabled}
    >
      <View>{icon}</View>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View>
        <Switch value={value} />
      </View>
    </TouchableOpacity>
  );
}
