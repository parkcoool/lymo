import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Linking from "expo-linking";

import { SettingItem } from "@/entities/setting/ui/SettingItem";

import { styles } from "./styles";

export default function PrivacyTipItem() {
  const handlePress = () => {
    Linking.openURL(
      "https://jagged-stone-714.notion.site/Lymo-2c40a4483ff6801aad04ecaad94214a3?source=copy_link"
    );
  };

  return (
    <SettingItem
      icon={<MaterialIcons name="privacy-tip" style={styles.icon} size={24} />}
      title="개인정보처리방침"
      onPress={handlePress}
    />
  );
}
