import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

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

  // 마운트 시 설정을 AsyncStorage에서 불러오기
  useEffect(() => {
    AsyncStorage.getItem("setting").then((value) => {
      if (!value) return;

      try {
        const settingJSON = JSON.parse(value);
        if (!isSettingJSON(settingJSON)) throw new Error("Invalid setting JSON");

        const parsed = parseSettingJSON(settingJSON);
        setSetting(parsed);
      } catch {}
    });
  }, []);

  // 설정 업데이트 함수
  const handleUpdateSetting = async (newSetting: Setting | ((prev: Setting) => Setting)) => {
    if (typeof newSetting === "function") {
      setSetting((prev) => {
        const updated = newSetting(prev);
        const settingJSON = convertSettingToJSON(updated);
        AsyncStorage.setItem("setting", JSON.stringify(settingJSON));
        return updated;
      });
    } else {
      setSetting(newSetting);
      const settingJSON = convertSettingToJSON(newSetting);
      AsyncStorage.setItem("setting", JSON.stringify(settingJSON));
    }
  };

  return { setting, handleUpdateSetting };
}
