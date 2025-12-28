import { createElement, ReactNode } from "react";
import { buildContext } from "react-simplikit";

import useHandleSetting from "../hooks/useHandleSetting";

import type { Setting } from "./types";

interface SettingContextStates {
  /**
   * 앱 설정
   */
  setting: Setting;
}

interface SettingContextActions {
  /**
   * 설정을 업데이트합니다.
   * @param setting 업데이트할 설정
   */
  updateSetting: React.Dispatch<React.SetStateAction<Setting>>;
}

type SettingContextValues = SettingContextStates & SettingContextActions;

const [SettingContextProvider, useSettingStore] = buildContext<SettingContextValues>(
  "SettingContext",
  {
    setting: {
      sync: new Map(),
      language: "ko",
      showSectionNotes: true,
    },
    updateSetting: () => {},
  }
);

function SettingProvider({ children }: { children: ReactNode }) {
  const { setting, handleUpdateSetting } = useHandleSetting();

  // react-simplikit의 buildContext에서 생성된 Provider는 children을 props로 받도록 설계됨
  // eslint-disable-next-line react/no-children-prop
  return createElement(SettingContextProvider, {
    setting,
    updateSetting: handleUpdateSetting,
    children,
  });
}

export { SettingProvider, useSettingStore };
