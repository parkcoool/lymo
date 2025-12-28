import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useSettingStore } from "@/entities/setting/models/settingStore";
import { SettingToggleItem } from "@/entities/setting/ui/SettingItem";

import { styles } from "./styles";

export default function SectionNote() {
  const { setting, updateSetting } = useSettingStore();

  const handleToggle = (value: boolean) => {
    updateSetting((prev) => ({ ...prev, showSectionNotes: value }));
  };

  return (
    <SettingToggleItem
      icon={<MaterialIcons name="lightbulb" style={styles.icon} size={24} />}
      title="문단 이해하기"
      description={`가사 문단 상단 "이해하기" 표시`}
      value={setting.showSectionNotes}
      onValueChange={handleToggle}
    />
  );
}
