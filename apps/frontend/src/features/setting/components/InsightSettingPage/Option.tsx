import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";

interface OptionProps {
  title: string;
  description: string;
  value: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export default function Option({ title, description, value, onPress, disabled }: OptionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.option, disabled && styles.disabledOption]}
      disabled={disabled}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.fill, !value && styles.invisible]} />
      </View>

      <View style={styles.optionRight}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}
