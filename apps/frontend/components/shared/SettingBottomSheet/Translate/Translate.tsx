import { View } from "react-native";

import { useSettingStore } from "@/contexts/useSettingStore";

import { styles } from "./Translate.styles";

export default function Translate() {
  const { setting, updateSetting } = useSettingStore();

  return <View style={styles.content}></View>;
}
