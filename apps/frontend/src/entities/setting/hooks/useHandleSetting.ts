import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import MediaInsightServiceModule from "modules/media-insight-service/src/MediaInsightServiceModule";

import type { Setting } from "../models/types";
import convertSettingToJSON from "../utils/convertSettingToJSON";
import isSettingJSON from "../utils/isSettingJSON";
import parseSettingJSON from "../utils/parseSettingJSON";

/**
 * 앱 설정을 AsyncStorage에서 불러오고 업데이트하는 훅
 * @returns 설정과 설정 업데이트 함수
 */
export default function useHandleSetting() {
  const [setting, setSetting] = useState<Setting>({
    sync: new Map(),
    language: "ko",
    showSectionNotes: true,
  });

  // 마운트 시
  useEffect(() => {
    // AsyncStorage에서 설정 불러오기
    AsyncStorage.getItem("setting").then((value) => {
      if (!value) return;

      try {
        const settingJSON = JSON.parse(value);
        if (!isSettingJSON(settingJSON)) return;

        const parsed = parseSettingJSON(settingJSON);
        setSetting((prev) => ({ ...prev, ...parsed }));
      } catch {}
    });

    // MediaInsightService에서 알림 빈도 설정 불러오기
    const notificationFrequency = MediaInsightServiceModule.getNotificationFrequency() ?? undefined;
    setSetting((prev) => ({ ...prev, notificationFrequency }));
    MediaInsightServiceModule.setEnabled(
      notificationFrequency !== "never" && notificationFrequency !== undefined
    );
  }, []);

  // 설정 업데이트 함수
  const handleUpdateSetting = async (newSetting: Setting | ((prev: Setting) => Setting)) => {
    if (typeof newSetting === "function") {
      setSetting((prev) => {
        const updated = newSetting(prev);

        const settingJSON = convertSettingToJSON(updated);
        AsyncStorage.setItem("setting", JSON.stringify(settingJSON));

        const { notificationFrequency } = updated;
        if (notificationFrequency)
          MediaInsightServiceModule.setNotificationFrequency(notificationFrequency);
        MediaInsightServiceModule.setEnabled(
          notificationFrequency !== "never" && notificationFrequency !== undefined
        );

        return updated;
      });
    } else {
      setSetting(newSetting);

      const settingJSON = convertSettingToJSON(newSetting);
      AsyncStorage.setItem("setting", JSON.stringify(settingJSON));

      const { notificationFrequency } = newSetting;
      if (notificationFrequency)
        MediaInsightServiceModule.setNotificationFrequency(notificationFrequency);
      MediaInsightServiceModule.setEnabled(
        notificationFrequency !== "never" && notificationFrequency !== undefined
      );
    }
  };

  return { setting, handleUpdateSetting };
}
