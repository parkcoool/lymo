import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LLMModel, LLMModelSchema } from "@lymo/schemas/shared";
import { Text, TouchableOpacity, View } from "react-native";

import { useSettingStore } from "@/contexts/useSettingStore";

import { getProviderNameFromLLMModel } from "./Model.helpers";
import { styles } from "./Model.styles";

const models = LLMModelSchema.options;

export default function Model() {
  const { setting, updateSetting } = useSettingStore();

  const isSelected = (model: LLMModel) => {
    return setting.defaultLLMModel === model;
  };

  const handleSelectModel = (model: LLMModel) => {
    updateSetting((prev) => ({ ...prev, defaultLLMModel: model }));
  };

  return (
    <View style={styles.content}>
      {models.map((model) => (
        <TouchableOpacity
          key={model}
          style={[styles.languageOption, isSelected(model) ? styles.selected : {}]}
          onPress={() => handleSelectModel(model)}
        >
          <Text style={styles.languageText}>{getProviderNameFromLLMModel(model)}</Text>
          {isSelected(model) && <MaterialIcons name="check" size={20} style={styles.checkIcon} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}
