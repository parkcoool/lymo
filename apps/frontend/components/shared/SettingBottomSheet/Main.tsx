import { usePathname } from "expo-router";
import { View } from "react-native";

import { useSettingStore } from "@/contexts/useSettingStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

import type { SettingViews } from "./SettingBottomSheet";
import {
  getSyncText,
  getTrackKey,
  getLanguageString,
} from "./SettingBottomSheet.helpers";
import { styles } from "./SettingBottomSheet.styles";
import SettingButton from "./SettingButton";
import SettingToggle from "./SettingToggle";

interface MainProps {
  setView: (view: SettingViews) => void;
}

export default function Main({ setView }: MainProps) {
  const pathname = usePathname();

  const { trackSource } = useTrackSourceStore();
  const { setting, updateSetting } = useSettingStore();

  // 현재 플레이어 화면인지 여부
  const isPlayerScreen = pathname.startsWith("/player");

  // `trackSyncDelay` map의 키로 사용할 트랙 키
  const trackKey = trackSource ? getTrackKey(trackSource) : null;

  return (
    <View style={styles.content}>
      {/* 곡 별 가사 싱크 */}
      {isPlayerScreen && trackKey && (
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
        content={getLanguageString(setting.translateTargetLanguage)}
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
