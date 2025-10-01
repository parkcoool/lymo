import { create } from "zustand";
import type { MediaData } from "@/types/nativeModules";

interface DeviceMediaStates {
  data: MediaData | null;
  timestamp: number;
  hasPermission: boolean;
}

interface DeviceMediaActions {
  setData: (mediaData: MediaData | null) => void;
  setTimestamp: (timestamp: number) => void;
  setHasPermission: (hasPermission: boolean) => void;
}

type MediaSessionStore = DeviceMediaStates & DeviceMediaActions;

export const useDeviceMediaStore = create<MediaSessionStore>((set) => ({
  data: null,
  timestamp: 0,
  hasPermission: false,

  setData: (session) => set({ data: session }),
  setTimestamp: (timestamp) => set({ timestamp }),
  setHasPermission: (hasPermission) => set({ hasPermission }),
}));
