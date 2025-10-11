import { create } from "zustand";
import type { DeviceMedia } from "@/types/nativeModules";

interface DeviceMediaStates {
  data: DeviceMedia | null;
  hasPermission: boolean;
}

interface DeviceMediaActions {
  setData: (mediaData: DeviceMedia | null) => void;
  setHasPermission: (hasPermission: boolean) => void;
}

type DeviceMediaStore = DeviceMediaStates & DeviceMediaActions;

export const useDeviceMediaStore = create<DeviceMediaStore>((set) => ({
  data: null,
  hasPermission: false,

  setData: (session) => set({ data: session }),
  setHasPermission: (hasPermission) => set({ hasPermission }),
}));
