import { createElement, useState, ReactNode } from "react";
import { buildContext } from "react-simplikit";

import type { DeviceMedia } from "@/shared/types/DeviceMedia";

interface DeviceMediaContextStates {
  /**
   * 기기에서 재생되는 미디어
   */
  deviceMedia: DeviceMedia | null;
}

interface DeviceMediaContextActions {
  /**
   * 기기에서 재생되는 미디어를 설정합니다.
   * @param deviceMedia 기기에서 재생되는 미디어
   */
  setData: (deviceMedia: DeviceMedia | null) => void;
}

type DeviceMediaContextValues = DeviceMediaContextStates & DeviceMediaContextActions;

const [DeviceMediaContextProvider, useDeviceMediaStore] = buildContext<DeviceMediaContextValues>(
  "DeviceMediaContext",
  {
    deviceMedia: null,
    setData: () => {},
  }
);

function DeviceMediaProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DeviceMedia | null>(null);

  // react-simplikit의 buildContext에서 생성된 Provider는 children을 props로 받도록 설계됨
  // eslint-disable-next-line react/no-children-prop
  return createElement(DeviceMediaContextProvider, {
    deviceMedia: data,
    setData,
    children,
  });
}

export { DeviceMediaProvider, useDeviceMediaStore };
