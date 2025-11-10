import AsyncStorage from "@react-native-async-storage/async-storage";
import { createElement, useState, useEffect, ReactNode } from "react";
import { buildContext } from "react-simplikit";

import type { Setting } from "@/types/setting";

interface SettingContextStates {
  /**
   * @description 앱 설정
   */
  setting: Setting;

  /**
   * @description 설정이 로드되었는지 여부
   */
  isLoading: boolean;
}

interface SettingContextActions {
  /**
   * @description 설정을 업데이트합니다.
   * @param setting 업데이트할 설정
   */
  updateSetting: React.Dispatch<React.SetStateAction<Setting>>;
}

type SettingContextValues = SettingContextStates & SettingContextActions;

const [SettingContextProvider, _useSettingStore] =
  buildContext<SettingContextValues>("SettingContext", {
    setting: {
      trackSyncDelay: new Map(),
      globalSyncDelay: 0,
      translateTargetLanguage: "ko",
      showParagraphSummary: true,
    },
    isLoading: true,
    updateSetting: () => {},
  });

function isSetting(obj: unknown): obj is Setting {
  if (typeof obj !== "object" || obj === null) return false;

  const typeMap = {
    syncDelay: "number",
    translateTargetLanguage: "string",
    showParagraphSummary: "boolean",
  };

  for (const [key, type] of Object.entries(typeMap)) {
    if (
      !(key in obj) ||
      typeof (obj as Record<string, unknown>)[key] !== type
    ) {
      return false;
    }
  }

  return true;
}

function SettingProvider({ children }: { children: ReactNode }) {
  const [setting, setSetting] = useState<Setting>({
    trackSyncDelay: new Map(),
    globalSyncDelay: 0,
    translateTargetLanguage: "ko",
    showParagraphSummary: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 설정을 AsyncStorage에서 불러옴
  useEffect(() => {
    AsyncStorage.getItem("setting")
      .then((value) => {
        if (!value) {
          setIsLoading(false);
          return;
        }

        try {
          const parsed = JSON.parse(value);
          if (!isSetting(parsed)) {
            setIsLoading(false);
            return;
          }
          setSetting(parsed);
        } catch {
          setIsLoading(false);
          return;
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleUpdateSetting = (
    newSetting: Setting | ((prev: Setting) => Setting)
  ) => {
    setSetting(newSetting);
    AsyncStorage.setItem("setting", JSON.stringify(newSetting));
  };

  // react-simplikit의 buildContext에서 생성된 Provider는 children을 props로 받도록 설계됨
  // eslint-disable-next-line react/no-children-prop
  return createElement(SettingContextProvider, {
    setting,
    isLoading,
    updateSetting: handleUpdateSetting,
    children,
  });
}

/**
 * @description 앱 설정을 관리하는 컨텍스트 훅입니다.
 */
const useSettingStore = _useSettingStore;

export { SettingProvider, useSettingStore };
