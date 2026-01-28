import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";

import { useSettingStore } from "@/entities/setting/models/settingStore";
import SettingBottomSheet from "@/entities/setting/ui/SettingBottomSheet";
import { SettingItem } from "@/entities/setting/ui/SettingItem";
import getLanguageName from "@/entities/setting/utils/getLanguageName";

import { styles } from "./styles";

export default function TranslateLanguage() {
  const { setting } = useSettingStore();
  const settingBottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePress = () => {
    settingBottomSheetRef.current?.present();
  };

  return (
    <>
      <SettingItem
        icon={<MaterialIcons name="translate" style={styles.icon} size={24} />}
        title="번역 대상 언어"
        description={getLanguageName(setting.language)}
        onPress={handlePress}
      />

      <SettingBottomSheet ref={settingBottomSheetRef} defaultView="language" />
    </>
  );
}
