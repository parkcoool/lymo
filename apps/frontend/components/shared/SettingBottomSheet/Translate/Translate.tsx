import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Language, LanguageSchema } from "@lymo/schemas/shared";
import { Text, TouchableOpacity, View } from "react-native";

import { useSettingStore } from "@/contexts/useSettingStore";

import { getLanguageName } from "./Translate.helpers";
import { styles } from "./Translate.styles";

const languages = LanguageSchema.options;

export default function Translate() {
  const { setting, updateSetting } = useSettingStore();

  const isSelected = (lang: Language) => {
    return setting.defaultLanguage === lang;
  };

  const handleSelectLanguage = (lang: Language) => {
    updateSetting((prev) => ({ ...prev, defaultLanguage: lang }));
  };

  return (
    <View style={styles.content}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang}
          style={[styles.languageOption, isSelected(lang) ? styles.selected : {}]}
          onPress={() => handleSelectLanguage(lang)}
        >
          <Text style={styles.languageText}>{getLanguageName(lang)}</Text>
          {isSelected(lang) && <MaterialIcons name="check" size={20} style={styles.checkIcon} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}
