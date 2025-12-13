import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type Language, LanguageSchema } from "@lymo/schemas/shared";
import { Text, TouchableOpacity, View } from "react-native";

import { useSettingStore } from "@/entities/setting/models/store";
import getLanguageName from "@/entities/setting/utils/getLanguageName";

import { styles } from "./styles";

const languages = LanguageSchema.options;

export default function LanguageSetting() {
  const { setting, updateSetting } = useSettingStore();

  const isSelected = (language: Language) => {
    return setting.language === language;
  };

  const handleSelectLanguage = (language: Language) => {
    updateSetting((prev) => ({ ...prev, language: language }));
  };

  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language}
          style={[styles.items, isSelected(language) ? styles.selected : {}]}
          onPress={() => handleSelectLanguage(language)}
        >
          <Text style={styles.itemText}>{getLanguageName(language)}</Text>
          {isSelected(language) && (
            <MaterialIcons name="check" size={20} style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
