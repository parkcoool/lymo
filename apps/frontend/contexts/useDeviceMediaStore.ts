import { createElement, useState, ReactNode } from "react";
import { buildContext } from "react-simplikit";

import type { DeviceMedia } from "@/types/mediaModule";

interface DeviceMediaContextStates {
  /**
   * @description 기기에서 재생되는 미디어
   */
  deviceMedia: DeviceMedia | null;

  /**
   * @description 기기가 알림 접근 권한을 앱에 부여했는지 여부
   */
  hasPermission: boolean;
}

interface DeviceMediaContextActions {
  /**
   * @description 기기에서 재생되는 미디어를 설정합니다.
   * @param deviceMedia 기기에서 재생되는 미디어
   */
  setData: (deviceMedia: DeviceMedia | null) => void;

  /**
   * @description 기기가 알림 접근 권한을 앱에 부여했는지를 나타내는 상태를 설정합니다.
   * @param hasPermission 기기가 알림 접근 권한을 앱에 부여했는지 여부
   */
  setHasPermission: (hasPermission: boolean) => void;
}

type DeviceMediaContextValues = DeviceMediaContextStates &
  DeviceMediaContextActions;

const [DeviceMediaContextProvider, _useDeviceMediaStore] =
  buildContext<DeviceMediaContextValues>("DeviceMediaContext", {
    deviceMedia: null,
    hasPermission: false,
    setData: () => {},
    setHasPermission: () => {},
  });

function DeviceMediaProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DeviceMedia | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // react-simplikit의 buildContext에서 생성된 Provider는 children을 props로 받도록 설계됨
  // eslint-disable-next-line react/no-children-prop
  return createElement(DeviceMediaContextProvider, {
    deviceMedia: data,
    hasPermission,
    setData,
    setHasPermission,
    children,
  });
}

/**
 * @description 기기에서 재생되는 미디어 정보를 관리하는 컨텍스트 훅입니다.
 */
const useDeviceMediaStore = _useDeviceMediaStore;

export { DeviceMediaProvider, useDeviceMediaStore };
