import { View } from "react-native";

import { useSettingStore } from "@/contexts/useSettingStore";
import useTrackKey from "@/hooks/useTrackKey";

import type { SettingViews } from "./SettingBottomSheet";
import { styles } from "./SettingBottomSheet.styles";
import SettingButton from "./SettingButton";
import SettingToggle from "./SettingToggle";
import { getSyncText } from "./Sync/Sync.helpers";
import { getLanguageName } from "./Translate/Translate.helpers";

interface MainProps {
  setView: (view: SettingViews) => void;
}

export default function Main({ setView }: MainProps) {
  const trackKey = useTrackKey();
  const { setting, updateSetting } = useSettingStore();

  return (
    <View style={styles.content}>
      {/* 곡 별 가사 싱크 */}
      {trackKey && (
        <SettingButton
          icon="sync"
          label="곡 별 가사 싱크"
          content={getSyncText(setting.delayMap.get(trackKey) ?? 0)}
          onPress={() => setView("sync")}
        />
      )}

      {/* 번역 대상 언어 */}
      <SettingButton
        icon="translate"
        label="번역 대상 언어"
        content={getLanguageName(setting.defaultLanguage)}
        onPress={() => setView("translate")}
      />

      {/* 문단 요약 보이기 */}
      <SettingToggle
        icon="summarize"
        label="문단 요약 보이기"
        value={setting.showParagraphSummary}
        onValueChange={(value: boolean) =>
          updateSetting((prev) => ({ ...prev, showParagraphSummary: value }))
        }
      />
    </View>
  );
}
