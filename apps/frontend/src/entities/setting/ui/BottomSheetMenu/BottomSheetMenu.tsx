import { View } from "react-native";

import useCurrentTrackId from "@/entities/player/hooks/useCurrentTrackId";
import { useSettingStore } from "@/entities/setting/models/settingStore";
import type { SettingViews } from "@/entities/setting/models/types";
import getLanguageName from "@/entities/setting/utils/getLanguageName";
import getSyncText from "@/entities/setting/utils/getSyncText";

import Item from "./Item";
import { styles } from "./styles";

interface SettingMenuProps {
  setView: (view: SettingViews) => void;
}

export default function BottomSheetMenu({ setView }: SettingMenuProps) {
  const trackId = useCurrentTrackId();
  const { setting } = useSettingStore();

  return (
    <View style={styles.container}>
      {/* 곡 별 가사 싱크 */}
      {trackId && (
        <Item
          icon="sync"
          label="곡 별 가사 싱크"
          content={getSyncText(setting.sync.get(trackId) ?? 0)}
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
