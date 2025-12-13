import { View } from "react-native";

import { useSettingStore } from "@/entities/setting/models/store";
import type { SettingViews } from "@/entities/setting/models/types";
import getLanguageName from "@/entities/setting/utils/getLanguageName";
import getSyncText from "@/entities/setting/utils/getSyncText";
import useTrackKey from "@/features/player/hooks/useTrackKey";

import Item from "./Item";
import { styles } from "./styles";

interface SettingMenuProps {
  setView: (view: SettingViews) => void;
}

export default function SettingMenu({ setView }: SettingMenuProps) {
  const trackKey = useTrackKey();
  const { setting } = useSettingStore();

  return (
    <View style={styles.container}>
      {/* 곡 별 가사 싱크 */}
      {trackKey && (
        <Item
          icon="sync"
          label="곡 별 가사 싱크"
          content={getSyncText(setting.sync.get(trackKey) ?? 0)}
          onPress={() => setView("sync")}
        />
      )}

      {/* 번역 대상 언어 */}
      <Item
        icon="translate"
        label="번역 대상 언어"
        content={getLanguageName(setting.language)}
        onPress={() => setView("language")}
      />
    </View>
  );
}
