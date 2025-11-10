import type MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Fragment } from "react";
import { View } from "react-native";

import { useSettingStore } from "@/contexts/useSettingStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

import type { SettingViews } from "./SettingBottomSheet";
import { getSyncText, getTranslateText } from "./SettingBottomSheet.helpers";
import { styles } from "./SettingBottomSheet.styles";
import SettingButton from "./SettingButton";
import SettingToggle from "./SettingToggle";

type SettingItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  content?: string;
} & (
  | { type: "button"; onPress: () => void }
  | { type: "toggle"; value: boolean; onValueChange: (value: boolean) => void }
);

interface MainProps {
  setView: (view: SettingViews) => void;
}

export default function Main({ setView }: MainProps) {
  const { trackSource } = useTrackSourceStore();
  const { setting, updateSetting } = useSettingStore();

  const trackId =
    trackSource && "id" in trackSource?.track
      ? trackSource.track.id
      : undefined;

  const settingItems: SettingItem[] = [
    // 전체 가사 싱크
    {
      type: "button",
      icon: "sync",
      label: "전체 가사 싱크",
      content: getSyncText(setting.globalSyncDelay),
      onPress: () => setView("sync"),
    },

    // 곡 별 가사 싱크
    ...(trackId
      ? [
          {
            type: "button" as const,
            icon: "sync" as const,
            label: "곡 별 가사 싱크",
            content: getSyncText(setting.trackSyncDelay.get(trackId) ?? 0),
            onPress: () => setView("sync"),
          },
        ]
      : []),

    // 번역 대상 언어
    {
      type: "button",
      icon: "translate",
      label: "번역 대상 언어",
      content: getTranslateText(setting.translateTargetLanguage),
      onPress: () => setView("translate"),
    },

    // 요약 보이기
    {
      type: "toggle",
      icon: "summarize",
      label: "요약 보이기",
      value: setting.showParagraphSummary,
      onValueChange: (value: boolean) =>
        updateSetting((prev) => ({ ...prev, showParagraphSummary: value })),
    },
  ];

  return (
    <View style={styles.actionContainer}>
      {settingItems.map((item, index) => (
        <Fragment key={item.label}>
          {item.type === "button" && <SettingButton key={index} {...item} />}
          {item.type === "toggle" && <SettingToggle key={index} {...item} />}
        </Fragment>
      ))}
    </View>
  );
}
