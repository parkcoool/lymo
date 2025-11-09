import React, { useState, ReactNode } from "react";
import { buildContext } from "react-simplikit";
import type { DeviceMedia } from "@/types/nativeModules";

interface DeviceMediaContextStates {
  data: DeviceMedia | null;
  hasPermission: boolean;
}

interface DeviceMediaContextActions {
  setData: (mediaData: DeviceMedia | null) => void;
  setHasPermission: (hasPermission: boolean) => void;
}

type DeviceMediaContextValues = DeviceMediaContextStates &
  DeviceMediaContextActions;

const [DeviceMediaContextProvider, useDeviceMediaStore] =
  buildContext<DeviceMediaContextValues>("DeviceMediaContext", {
    data: null,
    hasPermission: false,
    setData: () => {},
    setHasPermission: () => {},
  });

export function DeviceMediaProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DeviceMedia | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  return React.createElement(DeviceMediaContextProvider, {
    data,
    hasPermission,
    setData,
    setHasPermission,
    children,
  });
}

export { useDeviceMediaStore };
